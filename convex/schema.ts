import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  characters: defineTable({
    name: v.string(),
    avatarUrl: v.string(),
    description: v.string(),
    model: v.string(),
    systemPrompt: v.string(),
    instructions: v.string(),
    uniqueName: v.string(),
  }),
  chats: defineTable({
    title: v.optional(v.string()),
    host: v.id("characters"),
    participants: v.optional(v.array(v.id("characters"))),
  }),
  messages: defineTable({
    chatId: v.id("chats"),
    sender: v.id("characters"),
    role: v.union(
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
    ),
    content: v.string(),
  }),
});
