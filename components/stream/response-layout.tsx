"use client";
import { AI } from "@/actions/stream-state";
import {
  ID_ASSISTANT_SUFFIX,
  ID_TOOL_SUFFIX,
  ID_USE_SUFFIX,
} from "@/config/constants";
import { text } from "@/config/primitives";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { useAIState, useUIState } from "ai/rsc";
import clsx from "clsx";
import { Close, Logo } from "../common/icons";

interface Props {
  id?: string;
  message: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const ResponseLayout = ({
  message,
  children,
  isLoading = false,
  id,
}: Props) => {
  const [iaState, setIaState] = useAIState<typeof AI>();
  const [uiState, setUiState] = useUIState<typeof AI>();

  const handleRemove = () => {
    const iaStateIds = [
      id + ID_USE_SUFFIX,
      id + ID_ASSISTANT_SUFFIX,
      id + ID_TOOL_SUFFIX,
    ];
    setUiState({
      ...uiState,
      components: uiState.components.filter((ui) => ui.id !== id),
    });
    setIaState({
      ...iaState,
      messages: iaState.messages.filter(
        (message) => !iaStateIds.includes(message.id)
      ),
    });
  };

  return (
    <div>
      <div className="flex justify-between">
        <div
          className={clsx("flex gap-4 items-center mb-6", {
            "animate-pulse": isLoading,
          })}
        >
          <div className="bg-content1 rounded-full p-2">
            <Logo />
          </div>
          <p className={text({})}>"{message}"</p>
        </div>
        {!isLoading && id && (
          <Tooltip showArrow content="Borrar resultados">
            <Button
              isIconOnly
              variant="light"
              onClick={handleRemove}
              aria-label="Borrar resultados"
            >
              <Close />
            </Button>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
};
