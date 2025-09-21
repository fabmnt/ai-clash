import type { Id } from "#/convex/_generated/dataModel";
import { Container } from "@/components/container";
import { ChatHeader } from "@/features/characters/components/chat-header";
import { Chat } from "@/features/chats/components/chat";

export default async function ChatPage(props: PageProps<"/chat/[id]">) {
  const { id } = await props.params;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <ChatHeader characterId={id as Id<"characters">} />
        <Container className="h-full max-w-4xl mx-auto">
          <Chat characterId={id as Id<"characters">} />
        </Container>
      </div>
    </div>
  );
}
