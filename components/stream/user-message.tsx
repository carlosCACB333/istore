"use client";

import { AI } from "@/actions/stream-state";
import { getuiIds } from "@/config/constants";
import { text } from "@/config/primitives";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { useActions, useUIState } from "ai/rsc";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { Close, Logo } from "../common/icons";

interface Props {
  id?: string;
  message: string;
  isLoading?: boolean;
  children?: ReactNode;
}

export const UserMessage = ({
  id,
  message,
  isLoading = false,
  children,
}: Props) => {
  const [uiState, setUiState] = useUIState<typeof AI>();
  const { removeMessage } = useActions<typeof AI>();

  const handleRemove = async () => {
    if (!id) return;
    setUiState({
      ...uiState,
      components: uiState.components.filter(
        (ui) => !getuiIds(id).includes(ui.id)
      ),
    });
    await removeMessage(id);
  };

  return (
    <>
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
    </>
  );
};
