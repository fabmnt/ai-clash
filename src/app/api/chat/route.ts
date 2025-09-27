import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
import { systemPrompt } from "@/config/prompts";
import type { AppUIMessage } from "@/features/chats/components/chat";

const openai = createOpenAI({
  apiKey: process.env.VENICE_API_KEY!,
  baseURL: "https://api.venice.ai/api/v1",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    message,
    chatId,
    characterId,
  }: { message: AppUIMessage; chatId: string; characterId: string } =
    await req.json();

  const metadata = message.metadata;

  if (!metadata) {
    return new Response("Bad request", {
      status: 400,
    });
  }

  if (!metadata.isParticipantRequest) {
    await fetchMutation(api.messages.createMessage, {
      chatId: chatId as Id<"chats">,
      sender: characterId as Id<"characters">,
      role: message.role,
      content: message.parts[0].type === "text" ? message.parts[0].text : "",
    });
  }

  const dbMessages = await fetchQuery(api.messages.getMessagesWithSender, {
    chatId: chatId as Id<"chats">,
  });

  const participants = await fetchQuery(api.chats.getParticipants, {
    chatId: chatId as Id<"chats">,
  });

  const textPart = message.parts.find((part) => part.type === "text");
  if (textPart == null) {
    return new Response("Bad request", {
      status: 400,
    });
  }

  const character = await fetchQuery(api.characters.getCharacter, {
    characterId: characterId as Id<"characters">,
  });

  if (!character) {
    return new Response("Character not found", {
      status: 404,
    });
  }

  const participantMentionRegex = /@(\w+)/g;
  let contentParticipantsReplaced = textPart.text ?? "";
  const contentParticipants = [
    ...(textPart.text.match(participantMentionRegex) ?? []),
    ...(character?.uniqueName ? [`@${character.uniqueName}`] : []),
  ];

  // replace all mentions with the participant's name and description
  for (const contentParticipant of contentParticipants) {
    const dbParticipant = participants.find(
      (participant) =>
        participant.uniqueName === contentParticipant.replace("@", ""),
    );
    if (!dbParticipant) {
      continue;
    }
    contentParticipantsReplaced =
      textPart.text.replaceAll(
        contentParticipant,
        `${dbParticipant.name} (${dbParticipant.description})`,
      ) ?? "";
  }

  const model = character?.model ?? "x-ai/grok-4-fast:free";
  console.log(
    `[CHAT:REQUEST] Using model: ${model}. Character: ${character?.name}`,
  );
  textPart.text = contentParticipantsReplaced;

  const messages: AppUIMessage[] = dbMessages.map((message) => ({
    role: message.role as "system" | "user" | "assistant",
    id: message._id,
    parts: [
      {
        type: "text",
        text: message.content,
      },
    ],
    metadata: {
      senderId: message.sender,
      isParticipantRequest: message.isParticipantRequest,
    },
  }));

  const result = streamText({
    model: openai.chat(model),
    providerOptions: {
      openai: {
        venice_parameters: {
          include_venice_system_prompt: false,
        },
      },
    },
    messages: convertToModelMessages([...messages, message]),
    system: systemPrompt(
      character,
      participants.map(
        (participant) => `${participant.name} (${participant.description})`,
      ),
    ),
  });

  return result.toUIMessageStreamResponse({
    messageMetadata: () => ({
      senderId: characterId,
      isParticipantRequest: false,
    }),
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
