import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMessage = mutation({
  args: {
    chatId: v.id("chats"),
    sender: v.id("characters"),
    role: v.union(
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
    ),
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

export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .collect();
  },
});

export const getMessagesWithSender = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .collect();

    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.sender);
        return {
          ...message,
          senderDetails: sender
            ? {
                name: sender.name,
                avatarUrl: sender.avatarUrl,
                uniqueName: sender.uniqueName,
              }
            : null,
        };
      }),
    );

    return messagesWithSender;
  },
});
