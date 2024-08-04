"use client";

import { MODELS } from "@/config/constants";
import {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";

interface AIState {
  model: MutableRefObject<string>;
  api_key: MutableRefObject<string>;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

const AIContext = createContext<AIState | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  apiKey?: string;
}

export const AIProvider = ({ children, apiKey = "" }: Props) => {
  const model = useRef<string>(MODELS.at(-1) || "");
  const api_key = useRef<string>(apiKey);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AIContext.Provider
      value={{
        model,
        api_key,
        isMenuOpen,
        setIsMenuOpen: (value) => setIsMenuOpen(value),
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within a AIProvider");
  }
  return context;
};
