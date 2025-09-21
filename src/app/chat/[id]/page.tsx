import Link from "next/link";
import { Container } from "@/components/container";

export default async function ChatPage(props: PageProps<"/chat/[id]">) {
  await props.params;

  return (
    <div className="flex h-full">
      <aside className="min-h-full px-4 py-2 bg-sidebar border-sidebar-border border-r border-t">
        <div>
          <div className="flex flex-col gap-2">
            <Link href="/chat/1">Chat 1</Link>
            <Link href="/chat/2">Chat 2</Link>
            <Link href="/chat/3">Chat 3</Link>
            <Link href="/chat/4">Chat 4</Link>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <header className="bg-foreground/10">
          <Container>
            <h1>Chat</h1>
          </Container>
        </header>
        <div>
          <Container>Elements</Container>
        </div>
      </div>
    </div>
  );
}
