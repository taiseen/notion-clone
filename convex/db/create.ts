import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
    // new document creating --> property || input-values
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },

    // new document creating --> handler || function()
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        // if user not login...
        if (!identity) throw new Error("Not authenticated");

        const userId = identity.subject;

        // new document creating...
        const document = ctx.db.insert('documents', {
            userId,
            title: args.title,
            isArchived: false,
            isPublished: false,
            parentDocument: args.parentDocument,
        });

        return document;
    },
});