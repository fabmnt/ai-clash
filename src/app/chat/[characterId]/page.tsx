import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";

export default async function ChatPage(
  props: PageProps<"/chat/[characterId]">,
) {
  const { characterId } = await props.params;

  const newChatId = await fetchMutation(api.chats.createChat, {
    host: characterId as Id<"characters">,
  });

  return redirect(`/chat/${characterId}/${newChatId}`);
}
