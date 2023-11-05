// import { mutation, query } from "./_generated/server";
// import { Doc, Id } from "./_generated/dataModel";
// import { v } from "convex/values";

// // const getUserId = async (ctx: any) => {
// //     const identity = await ctx.auth.getUserIdentity();
// //     if (!identity) throw new Error("Not authenticated");
// //     return identity.subject;
// // }

// export const get = query({

//     // only for get query/data form database...
//     handler: async (ctx) => {
//         const identity = ctx.auth.getUserIdentity();

//         // if user not login...
//         if (!identity) throw new Error("Not authenticated");

//         const data = await ctx.db.query("documents").collect();

//         return data;
//     },
// });

// export const getSidebar = query({
//     args: {
//         parentDocument: v.optional(v.id("documents"))
//     },

//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");
//         const userId = identity.subject;

//         // const userId = getUserId(ctx);

//         const documents = await ctx.db
//             .query("documents")
//             .withIndex("by_user_parent", (q) =>
//                 q
//                     .eq("userId", userId)
//                     .eq("parentDocument", args.parentDocument)
//             )
//             // deleted / archived data no need to display at sidebar
//             .filter((q) =>
//                 q.eq(q.field("isArchived"), false)
//             )
//             .order("desc")
//             .collect();

//         return documents;
//     },
// });

// export const create = mutation({
//     // new document creating --> property || input-values
//     args: {
//         title: v.string(),
//         parentDocument: v.optional(v.id("documents")),
//     },

//     // new document creating --> handler || function()
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();

//         // if user not login...
//         if (!identity) throw new Error("Not authenticated");

//         const userId = identity.subject;

//         // new document creating...
//         const document = ctx.db.insert('documents', {
//             userId,
//             title: args.title,
//             isArchived: false,
//             isPublished: false,
//             parentDocument: args.parentDocument,
//         });

//         return document;
//     },
// });

// export const archive = mutation({
//     args: { id: v.id("documents") },

//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");
//         const userId = identity.subject;

//         const existingDocument = await ctx.db.get(args.id);
//         if (!existingDocument) throw new Error("Not found");
//         if (existingDocument.userId !== userId) throw new Error("Unauthorized");

//         const recursiveArchive = async (documentId: Id<"documents">) => {
//             const children = await ctx.db
//                 .query("documents")
//                 .withIndex("by_user_parent", (q) => (
//                     q
//                         .eq("userId", userId)
//                         .eq("parentDocument", documentId)
//                 ))
//                 .collect();

//             // repeated for every child...
//             for (const child of children) {
//                 await ctx.db.patch(child._id, {
//                     isArchived: true,
//                 });

//                 // call recursive() for every child... 
//                 await recursiveArchive(child._id);
//             }
//         }

//         const document = await ctx.db.patch(args.id, { isArchived: true });

//         // function call --> start form here...
//         recursiveArchive(args.id);

//         return document;
//     }
// })

// export const getTrash = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");
//         const userId = identity.subject;

//         const documents = await ctx.db
//             .query("documents")
//             .withIndex("by_user", (q) => q.eq("userId", userId))
//             .filter((q) =>
//                 q.eq(q.field("isArchived"), true),
//             )
//             .order("desc")
//             .collect();

//         return documents;
//     }
// });

// export const restore = mutation({
//     args: { id: v.id("documents") },

//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");
//         const userId = identity.subject;

//         const existingDocument = await ctx.db.get(args.id);
//         if (!existingDocument) throw new Error("Not found");
//         if (existingDocument.userId !== userId) throw new Error("Unauthorized");

//         const recursiveRestore = async (documentId: Id<"documents">) => {
//             const children = await ctx.db
//                 .query("documents")
//                 .withIndex("by_user_parent", (q) => (
//                     q
//                         .eq("userId", userId)
//                         .eq("parentDocument", documentId)
//                 ))
//                 .collect();

//             for (const child of children) {
//                 await ctx.db.patch(child._id, { isArchived: false });

//                 await recursiveRestore(child._id);
//             }
//         }

//         const options: Partial<Doc<"documents">> = { isArchived: false };

//         if (existingDocument.parentDocument) {
//             const parent = await ctx.db.get(existingDocument.parentDocument);

//             if (parent?.isArchived) {
//                 options.parentDocument = undefined;
//             }
//         }

//         const document = await ctx.db.patch(args.id, options);

//         recursiveRestore(args.id);

//         return document;
//     }
// });

// export const remove = mutation({
//     args: { id: v.id("documents") },

//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");
//         const userId = identity.subject;

//         const existingDocument = await ctx.db.get(args.id);
//         if (!existingDocument) throw new Error("Not found");
//         if (existingDocument.userId !== userId) throw new Error("Unauthorized");

//         const document = await ctx.db.delete(args.id);

//         return document;
//     }
// });