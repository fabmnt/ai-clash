"use client";

import { useQuery } from "convex/react";
import { ArrowLeftIcon, EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import { Container } from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  characterId: Id<"characters">;
};

export function ChatHeader({ characterId }: ChatHeaderProps) {
  const character = useQuery(api.characters.getCharacter, { characterId });

  return (
    <Container className="py-4 bg-sidebar">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="size-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={character?.avatarUrl ?? ""}
                alt={character?.name ?? ""}
              />
              <AvatarFallback>
                {character?.name?.slice(0, 2) ?? "ME"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {character?.name ?? "ME"}
              </h2>
            </div>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="sm">
            <EllipsisVerticalIcon />
          </Button>
        </div>
      </header>
    </Container>
  );
}
