"use client";

import { Trash2Icon, UserPlusIcon } from "lucide-react";
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

type BasicParticipant = {
  _id?: string;
  id?: string;
  name?: string | null;
  avatarUrl?: string | null;
};

type ParticipantsDialogProps = {
  participants: BasicParticipant[];
};

export function ParticipantsDialog({ participants }: ParticipantsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <span className="text-sm text-muted-foreground">Participants:</span>
          <div className="flex items-center">
            {participants?.map((participant, index) => {
              const key = participant._id ?? participant.id ?? `${index}`;
              const initials = participant?.name?.slice(0, 2) ?? "?";
              return (
                <Avatar
                  key={key}
                  className={`relative left-${(index + 1) * 2} last:left-0`}
                >
                  <AvatarImage
                    src={participant?.avatarUrl ?? undefined}
                    alt={participant?.name ?? ""}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              );
            })}
          </div>
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
            <Input placeholder="Enter user email or ID" />
            <Button variant="ghost" type="button" className="shrink-0">
              <UserPlusIcon className="size-4" />
              Add
            </Button>
          </div>

          <div className="rounded-md border">
            {participants && participants.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto">
                {participants.map((participant, index) => {
                  const key = participant._id ?? participant.id ?? `${index}`;
                  const initials = participant?.name?.slice(0, 2) ?? "?";
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between gap-3 p-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar>
                          <AvatarImage
                            src={participant?.avatarUrl ?? undefined}
                            alt={participant?.name ?? ""}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {participant?.name ?? "Unknown"}
                          </p>
                          {(participant?._id || participant?.id) && (
                            <p className="truncate text-muted-foreground text-xs">
                              {(participant._id ?? participant.id) as string}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" type="button" size="sm">
                        <Trash2Icon className="size-4" />
                        Remove
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
