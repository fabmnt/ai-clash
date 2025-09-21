import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createMessage = mutation({
  args: {
    chatId: v.id("chats"),
    sender: v.id("characters"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      chatId: args.chatId,
      sender: args.sender,
      role: args.role,
      content: args.content,
    });
  },
});
