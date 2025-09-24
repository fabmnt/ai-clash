"use client";

import { useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatListProps {
  characterId: Id<"characters">;
}

export function ChatList({ characterId }: ChatListProps) {
  const characterChats = useQuery(api.chats.getCharacterChats, {
    characterId,
  });
  const pathname = usePathname();

  // Check if we're on a specific chat page
  const isActiveChat = (chatId: string) => {
    return pathname === `/chat/${characterId}/${chatId}`;
  };

  // Check if we're on the new chat page
  const isNewChatActive = pathname === `/chat/${characterId}`;

  return (
    <div className="h-full space-y-4">
      <h3 className="text-sm font-medium text-sidebar-foreground">Chats</h3>
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
          <li key={chat._id}>
            <Button
              variant={isActiveChat(chat._id) ? "secondary" : "ghost"}
              className="justify-start"
              asChild
            >
              <Link
                className={cn(
                  "w-[20ch] truncate font-normal text-muted-foreground",
                  isActiveChat(chat._id) && "font-medium text-primary",
                )}
                href={`/chat/${characterId}/${chat._id}`}
              >
                {chat.title || "Untitled chat"}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
