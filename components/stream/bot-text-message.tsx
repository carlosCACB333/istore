"use client";
import { useStreamableText } from "@/hooks/use-streamable-text";
import { StreamableValue } from "ai/rsc/dist";

export const BotTextMessage = ({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) => {
  const text = useStreamableText(content);
  return <div className={className}>{text}</div>;
};
