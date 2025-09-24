"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery } from "convex/react";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { api } from "#/convex/_generated/api";
import type { Id } from "#/convex/_generated/dataModel";
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

type ChatProps = {
  characterId: Id<"characters">;
  chatId: Id<"chats">;
  initialMessages: UIMessage[];
};

export function Chat({ characterId, chatId, initialMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const characters = useQuery(api.characters.getCharacters);
  const character = useQuery(api.characters.getCharacter, { characterId });
  const [selectedCharacter, setSelectedCharacter] =
    useState<Id<"characters">>(characterId);
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
  });

  const handleSubmit = (message: PromptInputMessage) => {
    sendMessage(
      {
        text: message.text ?? "",
      },
      {
        body: {
          chatId,
          characterId: selectedCharacter,
        },
      },
    );
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);

    if (!inputValue.includes("@")) {
      return;
    }

    const inputCharacterQuery = inputValue.split("@")[1].split(" ")[0];
    const inputCharacter = characters?.find(
      (character) => character.uniqueName === inputCharacterQuery,
    );
    if (inputCharacter) {
      setSelectedCharacter(inputCharacter._id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-4">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
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
              </div>
            ))}
            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Response>Loading...</Response>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
        </Conversation>
      </div>
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
