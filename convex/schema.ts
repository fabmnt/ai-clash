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
  }),
});
