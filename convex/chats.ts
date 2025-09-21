import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChat = mutation({
  args: {
    host: v.id("characters"),
  },
  handler: async (ctx, args) => {
    const newChat = await ctx.db.insert("chats", {
      host: args.host,
    });
    return newChat;
  },
});

export const getChat = query({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.id))
      .collect();

    return {
      ...chat,
      messages,
    };
  },
});
