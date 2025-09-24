"use client";

import { useMutation, useQuery } from "convex/react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "#/convex/_generated/api";
import type { Doc, Id } from "#/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

type ParticipantsDialogProps = {
  participants: Doc<"characters">[];
  chatId: Id<"chats">;
};

export function ParticipantsDialog({
  participants,
  chatId,
}: ParticipantsDialogProps) {
  const [search, setSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const trimmedSearch = search.trim();
  const characters = useQuery(api.characters.searchCharacters, {
    query: trimmedSearch,
  });
  const characterResults = characters ?? [];
  const hasResults = characterResults.length > 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const addParticipants = useMutation(api.chats.addParticipants);
  const removeParticipants = useMutation(api.chats.removeParticipants);

  useEffect(() => {
    if (trimmedSearch.length === 0) {
      setPopoverOpen(false);
    }
  }, [trimmedSearch]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-normal">
          {participants.length > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">
                Participants:
              </span>
              <div className="flex items-center">
                {participants?.map((participant, index) => {
                  const key = participant._id;
                  const initials = participant.name.slice(0, 2);
                  return (
                    <Avatar
                      key={key}
                      className={`relative left-${(index + 1) * 2} last:left-0`}
                    >
                      <AvatarImage
                        src={participant.avatarUrl}
                        alt={participant.name}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">Add participants</span>
              <PlusIcon />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Participants</DialogTitle>
          <DialogDescription>
            View, add, or remove participants in this chat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Popover
              open={popoverOpen && trimmedSearch.length > 0}
              onOpenChange={setPopoverOpen}
              modal={false}
            >
              <PopoverAnchor asChild>
                <Input
                  ref={inputRef}
                  value={search}
                  onChange={(event) => {
                    const value = event.target.value;
                    console.log(value);
                    setSearch(value);
                    if (value.trim().length > 0) {
                      setPopoverOpen(true);
                    }
                  }}
                  onFocus={() => {
                    if (trimmedSearch.length > 0) {
                      setPopoverOpen(true);
                    }
                  }}
                  autoComplete="off"
                  placeholder="Enter character name, unique name or ID"
                />
              </PopoverAnchor>
              <PopoverContent
                autoFocus={false}
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                }}
                align="start"
                sideOffset={8}
                style={{
                  width: inputRef.current?.clientWidth,
                }}
                className="bg-background min-h-40"
              >
                <div className="max-h-64 overflow-y-auto">
                  <ul className="divide-y">
                    {characterResults.map((character) => {
                      const initials = character.name?.slice(0, 2) ?? "?";
                      return (
                        <Button
                          key={character._id}
                          variant="ghost"
                          type="button"
                          size="lg"
                          className="flex items-center justify-between gap-3 py-6 hover:bg-muted w-full"
                          onClick={() => {
                            setPopoverOpen(false);
                            addParticipants({
                              chatId: chatId,
                              participants: [character._id],
                            });
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={character.avatarUrl ?? undefined}
                                alt={character.name ?? ""}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex items-center gap-2">
                              <p className="truncate font-medium">
                                {character.name ?? "Unknown"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                @{character.uniqueName}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <PlusIcon className="size-4" />
                          </div>
                        </Button>
                      );
                    })}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-md border">
            {participants && participants.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto">
                {participants.map((participant) => {
                  const key = participant._id;
                  const initials = participant.name.slice(0, 2);
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between gap-3 p-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar>
                          <AvatarImage
                            src={participant.avatarUrl}
                            alt={participant.name}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {participant.name}
                          </p>
                          <p className="truncate text-muted-foreground text-xs">
                            @{participant.uniqueName}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        type="button"
                        size="sm"
                        onClick={async () => {
                          await removeParticipants({
                            chatId: chatId,
                            participants: [participant._id],
                          });
                        }}
                      >
                        Remove
                        <Trash2Icon className="size-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No participants yet.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
