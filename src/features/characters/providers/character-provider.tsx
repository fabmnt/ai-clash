"use client";

import { useQuery } from "convex/react";
import { createContext, use } from "react";
import { api } from "#/convex/_generated/api";
import type { Doc, Id } from "#/convex/_generated/dataModel";

export const CharacterContext = createContext<Doc<"characters"> | undefined>(
  undefined,
);

type CharacterProviderProps = {
  children: React.ReactNode;
  characterId: Id<"characters">;
};

export function CharacterProvider({
  children,
  characterId,
}: CharacterProviderProps) {
  const character = useQuery(api.characters.getCharacter, { characterId });

  return (
    <CharacterContext value={character ?? undefined}>
      {children}
    </CharacterContext>
  );
}

export function useProvidedCharacter() {
  const character = use(CharacterContext);

  console.log("character", character);

  return character;
}
