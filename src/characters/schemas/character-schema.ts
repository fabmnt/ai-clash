import * as z from "zod";

export const CharacterSchema = z.object({
  _id: z.string(),
  name: z.string(),
  avatarUrl: z.url(),
  description: z.string(),
  model: z.string(),
  systemPrompt: z.string(),
  instructions: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Character = z.infer<typeof CharacterSchema>;
