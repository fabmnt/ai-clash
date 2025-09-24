import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCharacters = query({
  args: {},
  handler: async (ctx) => {
    const characters = await ctx.db.query("characters").collect();
    return characters;
  },
});

export const searchCharacters = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const characters = await ctx.db
      .query("characters")
      .withSearchIndex("search_participants", (q) =>
        q.search("name", args.query),
      )
      .take(5);

    return characters;
  },
});

export const getCharacter = query({
  args: { characterId: v.id("characters") },
  handler: async (ctx, args) => {
    const character = await ctx.db.get(args.characterId);
    return character;
  },
});

export const createCharacter = mutation({
  args: {
    character: v.object({
      name: v.string(),
      avatarUrl: v.string(),
      description: v.string(),
      model: v.string(),
      systemPrompt: v.string(),
      instructions: v.string(),
      uniqueName: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const existingCharacter = await ctx.db
      .query("characters")
      .withIndex("unique_name", (q) =>
        q.eq("uniqueName", args.character.uniqueName),
      )
      .unique();

    if (existingCharacter) {
      return null;
    }

    const character = await ctx.db.insert("characters", args.character);
    return character;
  },
});
