"use client";

import { useQuery } from "convex/react";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";

type ChatProps = {
  characterId: Id<"characters">;
};

export function Chat({ characterId }: ChatProps) {
  const character = useQuery(api.characters.getCharacter, { characterId });
  console.log(character);
  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex-1 overflow-y-auto space-y-4"></div>
      <PromptInput onSubmit={() => {}}>
        <PromptInputBody>
          <PromptInputTextarea placeholder={`Talk to ${character?.name}...`} />
        </PromptInputBody>
        <PromptInputToolbar className="flex justify-end">
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
