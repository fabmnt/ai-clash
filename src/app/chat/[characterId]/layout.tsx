import type { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChatList } from "@/features/chats/components/chat-list";

export default async function ChatLayout(
  props: LayoutProps<"/chat/[characterId]">,
) {
  const { children, params } = props;
  const { characterId } = await params;

  return (
    <div className="flex h-full">
      <aside className="hidden h-full w-44 border-r border-sidebar-border bg-sidebar px-2 py-6 md:block">
        <ChatList characterId={characterId as Id<"characters">} />
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3 md:hidden">
          <Drawer direction="bottom">
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm">
                Chats
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full rounded-none border-r border-sidebar-border bg-sidebar px-0 py-0">
              <DrawerTitle className="sr-only">Chats</DrawerTitle>
              {/*               <DrawerHeader className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <XIcon className="size-4" />
                  </Button>
                </DrawerClose>
              </DrawerHeader> */}
              <div className="h-full overflow-y-auto px-4 py-6">
                <ChatList characterId={characterId as Id<"characters">} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
