"use client";

import { useMutation, useQuery } from "convex/react";
import { EllipsisVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatListProps {
  characterId: Id<"characters">;
}

export function ChatList({ characterId }: ChatListProps) {
  const characterChats = useQuery(api.chats.getCharacterChats, {
    characterId,
  });
  const deleteChat = useMutation(api.chats.deleteChat);
  const pathname = usePathname();

  // Check if we're on a specific chat page
  const isActiveChat = (chatId: string) => {
    return pathname === `/chat/${characterId}/${chatId}`;
  };

  // Check if we're on the new chat page
  const isNewChatActive = pathname === `/chat/${characterId}`;

  return (
    <div className="h-full space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Chats</h3>
      <ul className="flex flex-col gap-2">
        <li>
          <Button
            variant={isNewChatActive ? "secondary" : "ghost"}
            className="w-full"
            asChild
          >
            <Link href={`/chat/${characterId}`}>
              New Chat
              <PlusIcon />
            </Link>
          </Button>
        </li>
        {characterChats?.map((chat) => (
          <li
            key={chat._id}
            className={cn(
              "relative hover:bg-accent/50 rounded-md text-foreground flex h-9",
              isActiveChat(chat._id) && "bg-accent/50",
            )}
          >
            <Button
              variant="ghost"
              className="justify-start max-w-[25ch] flex-1 min-w-0 h-full font-normal text-muted-foreground bg-transparent hover:bg-transparent hover:text-foreground rounded-md"
              asChild
            >
              <Link
                className={cn(
                  isActiveChat(chat._id) && "font-medium text-primary",
                )}
                href={`/chat/${characterId}/${chat._id}`}
              >
                {chat.title || "Untitled chat"}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex shrink-0 text-muted-foreground"
                >
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => deleteChat({ chatId: chat._id })}
                >
                  <TrashIcon className="size-4" />
                  Delete chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </div>
  );
}
