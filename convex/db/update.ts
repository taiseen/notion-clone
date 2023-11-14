import { Doc, Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const archive = mutation({
    args: { id: v.id("documents") },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) throw new Error("Not found");
        if (existingDocument.userId !== userId) throw new Error("Unauthorized");

        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            // repeated for every child...
            for (const child of children) {
                await ctx.db.patch(child._id, { isArchived: true });

                // call recursive() for every child... 
                await recursiveArchive(child._id);
            }
        }

        const document = await ctx.db.patch(args.id, { isArchived: true });

        // function call --> start form here...
        recursiveArchive(args.id);

        return document;
    }
})


export const restore = mutation({
    args: { id: v.id("documents") },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) throw new Error("Not found");
        if (existingDocument.userId !== userId) throw new Error("Unauthorized");

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, { isArchived: false });

                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"documents">> = { isArchived: false };

        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(existingDocument.parentDocument);

            if (parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return document;
    }
});


export const docUpdate = mutation({
    args: {
        id: v.id("documents"),
        icon: v.optional(v.string()),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        isPublished: v.optional(v.boolean())
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const userId = identity.subject;

        const { id, ...rest } = args;

        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) throw new Error("Not found");
        if (existingDocument.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(args.id, { ...rest });

        return document;
    },
});