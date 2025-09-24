import type { Id } from "#/convex/_generated/dataModel";
import { ChatList } from "@/features/chats/components/chat-list";

export default async function ChatLayout(
  props: LayoutProps<"/chat/[characterId]">,
) {
  const { children, params } = props;
  const { characterId } = await params;

  return (
    <div className="flex h-full">
      <aside className="w-44 px-2 py-6 h-full bg-sidebar border-r border-sidebar-border">
        <ChatList characterId={characterId as Id<"characters">} />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
