import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    message,
    chatId,
    characterId,
  }: { message: UIMessage; chatId: string; characterId: string } =
    await req.json();

  await fetchMutation(api.messages.createMessage, {
    chatId: chatId as Id<"chats">,
    sender: characterId as Id<"characters">,
    role: message.role,
    content: message.parts[0].type === "text" ? message.parts[0].text : "",
  });

  const dbMessages = await fetchQuery(api.messages.getMessages, {
    chatId: chatId as Id<"chats">,
  });

  const character = await fetchQuery(api.characters.getCharacter, {
    characterId: characterId as Id<"characters">,
  });

  const messages: UIMessage[] = dbMessages.map((message) => ({
    role: message.role as "system" | "user" | "assistant",
    id: message._id,
    parts: [
      {
        type: "text",
        text: message.content,
      },
    ],
  }));

  const model = character?.model ?? "x-ai/grok-4-fast:free";
  console.log(
    `[CHAT:REQUEST] Using model: ${model}. Character: ${character?.name}`,
  );

  const result = streamText({
    model: openrouter(model),
    messages: convertToModelMessages([...messages, message]),
    system: character?.systemPrompt,
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      const textType = responseMessage.parts.find(
        (part) => part.type === "text",
      );
      if (!textType) {
        return;
      }

      await fetchMutation(api.messages.createMessage, {
        chatId: chatId as Id<"chats">,
        sender: characterId as Id<"characters">,
        role: responseMessage.role,
        content: textType.text,
      });
    },
  });
}
