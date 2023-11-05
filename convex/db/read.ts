import { query } from "../_generated/server";
import { v } from "convex/values";

export const get = query({

    // only for get query/data form database...
    handler: async (ctx) => {
        const identity = ctx.auth.getUserIdentity();

        // if user not login...
        if (!identity) throw new Error("Not authenticated");

        const data = await ctx.db.query("documents").collect();

        return data;
    },
});

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents"))
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        // const userId = getUserId(ctx);

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocument", args.parentDocument)
            )
            // deleted / archived data no need to display at sidebar
            .filter((q) =>
                q.eq(q.field("isArchived"), false)
            )
            .order("desc")
            .collect();

        return documents;
    },
});


export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) =>
                q.eq(q.field("isArchived"), true),
            )
            .order("desc")
            .collect();

        return documents;
    }
});