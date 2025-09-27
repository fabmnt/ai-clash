"use client";

import { useQuery } from "convex/react";
import { api } from "#/convex/_generated/api";
import { CharacterCard } from "./character-card";

export function CharactersGrid() {
  const characters = useQuery(api.characters.getCharacters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters?.map((character) => (
        <CharacterCard key={character._id} character={character} />
      ))}
    </div>
  );
}
