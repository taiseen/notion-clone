import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const remove = mutation({
    args: { id: v.id("documents") },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) throw new Error("Not found");
        if (existingDocument.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.delete(args.id);

        return document;
    }
});