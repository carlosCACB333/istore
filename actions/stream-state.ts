import { getAiIds } from "@/config/constants";
import { AIActions } from "@/types";
import { Chat } from "@/types/chat";
import { Cart, Product } from "@/types/product";
import { createAI, getAIState, getMutableAIState } from "ai/rsc";
import { ReactNode } from "react";
import { saveChat } from "./chat";
import { getUIStateFromAIState, streamComponent } from "./stream-ui";
import { createNewCart } from "./utils";

export type AIState = Chat & {
  cart: Cart[];
  saveState: "INIT" | "SAVED" | "RESTORED";
};
export interface UIState {
  isLoading: boolean;
  components: { id: string; component: ReactNode }[];
}

export interface ActionState extends AIActions {
  onSubmitForm: typeof onSubmitForm;
  addProductToCart: typeof addProductToCart;
  removeProductFromCart: typeof removeProductFromCart;
  removeMessage: typeof removeMessage;
  resetAIState: typeof resetAIState;
}

const initAIState: AIState = {
  api_key: "",
  model: "",
  id: "",
  messages: [],
  cart: [],
  saveState: "INIT",
};

export const onSubmitForm = async (
  model: string,
  api_key: string,
  input: string
): Promise<{
  component: ReactNode;
  id: string;
}> => {
  "use server";
  return await streamComponent(model, api_key, input);
};

const addProductToCart = async (
  product: Product,
  quantity: number
): Promise<void> => {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  const newCart = createNewCart(aiState.get().cart, product, quantity);

  aiState.done({
    ...aiState.get(),
    cart: newCart,
  });
};

const removeProductFromCart = async (product: Product): Promise<void> => {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  const cart = aiState
    .get()
    .cart.filter((item) => item.product.id !== product.id);
  aiState.done({
    ...aiState.get(),
    cart,
  });
};

const removeMessage = async (id: string) => {
  "use server";
  const aiIds = getAiIds(id);
  const aiState = getMutableAIState<typeof AI>();
  const state = aiState.get();
  aiState.done({
    ...state,
    messages: state.messages.filter((message) => !aiIds.includes(message.id)),
  });
};

const resetAIState = async () => {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  aiState.done({
    ...initAIState,
    saveState: "RESTORED",
  });
};

export const AI = createAI<AIState, UIState, ActionState>({
  initialAIState: initAIState,
  initialUIState: {
    isLoading: false,
    components: [],
  },
  actions: {
    onSubmitForm,
    addProductToCart,
    removeProductFromCart,
    removeMessage,
    resetAIState,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    console.log("Saving chat", state);

    if (!done || state.saveState === "SAVED") return;

    const chat = {
      ...state,
      messages: state.messages.filter((message) => message.role !== "tool"),
    };

    await saveChat(chat);
  },

  onGetUIState: async () => {
    "use server";
    const state = getAIState() as AIState;

    if (!state) {
      return undefined;
    }

    const ui = getUIStateFromAIState(state);

    return ui;
  },
});
