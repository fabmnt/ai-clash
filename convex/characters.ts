import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCharacters = query({
  args: {},
  handler: async (ctx) => {
    const characters = await ctx.db.query("characters").collect();
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
