import { fetchQuery } from "convex/nextjs";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import { Container } from "@/components/container";
import { ChatHeader } from "@/features/characters/components/chat-header";
import { type AppUIMessage, Chat } from "@/features/chats/components/chat";

export default async function ChatPage(
  props: PageProps<"/chat/[characterId]/[chatId]">,
) {
  const { characterId, chatId } = await props.params;
  const messages = await fetchQuery(api.messages.getMessagesWithSender, {
    chatId: chatId as Id<"chats">,
  });

  const initialMessages: AppUIMessage[] = messages.map((message) => ({
    role: message.role as "system" | "user" | "assistant",
    id: message._id,
    parts: [{ type: "text" as const, text: message.content }],
    metadata: {
      senderId: message.sender,
      isParticipantRequest: message.isParticipantRequest,
    },
  }));

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <ChatHeader
          characterId={characterId as Id<"characters">}
          chatId={chatId as Id<"chats">}
        />
        <div className="flex-1 overflow-hidden">
          <Container className="h-full max-w-4xl mx-auto">
            <Chat
              characterId={characterId as Id<"characters">}
              chatId={chatId as Id<"chats">}
              initialMessages={initialMessages}
            />
          </Container>
        </div>
      </div>
    </div>
  );
}
