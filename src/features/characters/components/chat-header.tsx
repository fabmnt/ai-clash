"use client";

import { useQuery } from "convex/react";
import { EllipsisVerticalIcon } from "lucide-react";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import { Container } from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  characterId: Id<"characters">;
  chatId: Id<"chats">;
};

export function ChatHeader({ characterId, chatId }: ChatHeaderProps) {
  const participants = useQuery(api.chats.getParticipants, { chatId });
  const character = useQuery(api.characters.getCharacter, { characterId });

  return (
    <header className="py-4 bg-sidebar border-b border-sidebar-border sticky top-0 z-10">
      <Container className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/*             <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeftIcon className="size-4" />
                Back
              </Link>
            </Button> */}
            <div className="flex flex-col gap-1">
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
                  <h2 className="font-semibold tracking-tight">
                    {character?.name ?? "ME"}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">
              <span className="text-sm text-muted-foreground">
                Participants:
              </span>
              <div className="flex items-center">
                {participants?.map((participant, i) => (
                  <Avatar
                    key={participant._id}
                    className={`relative left-${(i + 1) * 2} last:left-0`}
                  >
                    <AvatarImage
                      src={participant.avatarUrl}
                      alt={participant.name}
                    />
                    <AvatarFallback>
                      {participant.name?.slice(0, 2) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </Button>
            <Button variant="ghost" size="sm">
              <EllipsisVerticalIcon />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {character?.description ?? "ME"}
          </p>
        </div>
      </Container>
    </header>
  );
}
