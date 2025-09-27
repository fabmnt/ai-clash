"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery } from "convex/react";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Fragment, useState } from "react";
import * as z from "zod";
import { api } from "#/convex/_generated/api";
import type { Doc, Id } from "#/convex/_generated/dataModel";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const messageMetadataSchema = z.object({
  isParticipantRequest: z.boolean().optional(),
  senderId: z.string().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type AppUIMessage = UIMessage<MessageMetadata>;

type ChatProps = {
  characterId: Id<"characters">;
  chatId: Id<"chats">;
  initialMessages: AppUIMessage[];
};

function SenderAvatar({ character }: { character: Doc<"characters"> }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Avatar className="size-6">
        <AvatarImage src={character.avatarUrl} alt={character.name} />
        <AvatarFallback>
          {character.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-muted-foreground">
        {character.name}
      </span>
    </div>
  );
}

export function Chat({ characterId, chatId, initialMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const participants = useQuery(api.chats.getParticipants, { chatId }) ?? [];
  const chat = useQuery(api.chats.getChat, { id: chatId });
  const allParticipants = [...participants, chat?.host].filter(
    (p) => p != null,
  );
  const [selectedParticipant, setSelectedParticipant] = useState<
    Id<"characters"> | undefined
  >();
  const character = useQuery(api.characters.getCharacter, { characterId });
  const findSender = (senderId: Id<"characters">) => {
    return allParticipants.find((p) => p._id === senderId);
  };

  const { messages, sendMessage, status, regenerate } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages, body }) => {
        return {
          body: {
            ...body,
            id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
    onFinish: () => {
      setSelectedParticipant(undefined);
    },
  });

  const isLastMessage = (message: AppUIMessage) => {
    return message.id === messages.at(-1)?.id;
  };

  const handleSubmit = (message: PromptInputMessage) => {
    sendMessage(
      {
        text: message.text ?? "",
        metadata: {
          isParticipantRequest: false,
          senderId: selectedParticipant ?? characterId,
        },
      },
      {
        body: {
          chatId,
          characterId: selectedParticipant ?? characterId,
        },
      },
    );
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);

    if (!inputValue.includes("@")) {
      setSelectedParticipant(undefined);
      return;
    }

    const participantMentionRegex = /@(\w+)/g;
    const participantMatch = inputValue.match(participantMentionRegex)?.[0];
    const participant = participants.find(
      (participant) =>
        participant.uniqueName === participantMatch?.replace("@", ""),
    );
    setSelectedParticipant(participant?._id);
  };

  const replyAsParticipant = (participantId: Id<"characters">) => {
    const participant = allParticipants.find((p) => p._id === participantId);
    if (!participant) {
      return;
    }

    setSelectedParticipant(participantId);
    sendMessage(
      {
        text: `@${participant.uniqueName}`,
        metadata: {
          isParticipantRequest: true,
          senderId: participantId,
        },
      },
      {
        body: { chatId, characterId: participantId },
      },
    );
  };

  const messagesWithoutParticipantRequests = messages.filter(
    (message) => !message.metadata?.isParticipantRequest,
  );

  return (
    <div className="h-[720px] lg:h-[540px] overflow-y-auto flex flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messagesWithoutParticipantRequests.map((message) => {
            const sender = findSender(
              message.metadata?.senderId as Id<"characters">,
            );

            const showLoading =
              isLastMessage(message) &&
              message.role === "assistant" &&
              (status === "submitted" || status === "streaming");

            return (
              <div key={message.id}>
                {showLoading && (
                  <div>
                    <SenderAvatar
                      character={
                        findSender(
                          selectedParticipant ?? characterId,
                        ) as Doc<"characters">
                      }
                    />
                    <Message from="assistant">
                      <MessageContent>
                        <div className="loading loading-dots loading-sm" />
                      </MessageContent>
                    </Message>
                  </div>
                )}
                {message.role === "assistant" && sender && !showLoading && (
                  <SenderAvatar character={sender} />
                )}
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url",
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  label="Retry"
                                  onClick={() => regenerate()}
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </Fragment>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
                {message.role === "assistant" &&
                  status === "ready" &&
                  isLastMessage(message) && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Click to request a reply from:
                      </p>
                      <div className="flex items-center gap-2">
                        {allParticipants.map((participant) => (
                          <button
                            key={participant._id}
                            type="button"
                            className="rounded-full cursor-pointer"
                            onClick={() => replyAsParticipant(participant._id)}
                          >
                            <Avatar>
                              <AvatarImage
                                src={participant.avatarUrl}
                                alt={participant.name}
                              />
                              <AvatarFallback>
                                {participant.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </ConversationContent>
      </Conversation>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            placeholder={`Talk to ${character?.name}...`}
            value={input}
            onChange={handleInputChange}
          />
        </PromptInputBody>
      </PromptInput>
    </div>
  );
}
