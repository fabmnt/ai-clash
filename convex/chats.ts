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

export const getCharacterChats = query({
  args: {
    characterId: v.id("characters"),
  },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("host"), args.characterId))
      .collect();

    return chats.sort((a, b) => {
      const aDate = a._creationTime;
      const bDate = b._creationTime;
      return bDate - aDate;
    });
  },
});

export const addParticipants = mutation({
  args: {
    chatId: v.id("chats"),
    participants: v.array(v.id("characters")),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      return [];
    }
    const actualNewParticipants = args.participants.filter(
      (participant) => !chat.participants?.includes(participant),
    );

    if (actualNewParticipants.length === 0) {
      return [];
    }

    await ctx.db.patch(args.chatId, {
      participants: [...(chat.participants ?? []), ...actualNewParticipants],
    });

    return actualNewParticipants;
  },
});

export const removeParticipants = mutation({
  args: {
    chatId: v.id("chats"),
    participants: v.array(v.id("characters")),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      return [];
    }
    const updatedParticipants = chat.participants?.filter(
      (participant) => !args.participants.includes(participant),
    );

    return await ctx.db.patch(args.chatId, {
      participants: updatedParticipants,
    });
  },
});

export const getParticipants = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      return [];
    }
    const participantsPromises = chat.participants?.map((participantId) =>
      ctx.db.get(participantId),
    );
    if (!participantsPromises) {
      return [];
    }
    const participants = await Promise.all(participantsPromises);
    return participants.filter((participant) => participant !== null);
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.chatId);
  },
});
