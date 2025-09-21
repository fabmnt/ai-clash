import type { Id } from "#/convex/_generated/dataModel";
import { Container } from "@/components/container";
import { ChatHeader } from "@/features/characters/components/chat-header";
import { Chat } from "@/features/chats/components/chat";

export default async function ChatPage(
  props: PageProps<"/chat/[characterId]/[chatId]">,
) {
  const { characterId, chatId } = await props.params;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <ChatHeader characterId={characterId as Id<"characters">} />
        <Container className="h-full max-w-4xl mx-auto">
          <Chat
            characterId={characterId as Id<"characters">}
            chatId={chatId as Id<"chats">}
          />
        </Container>
      </div>
    </div>
  );
}
