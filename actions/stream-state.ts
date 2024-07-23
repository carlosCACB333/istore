import { MODELS } from "@/config/constants";
import { AIActions } from "@/types";
import { Cart, Product } from "@/types/product";
import { CoreMessage } from "ai";
import { createAI, getMutableAIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { ReactNode } from "react";
import { streamComponent } from "./stream-ui";
import { createNewCart } from "./utils";

type Message = CoreMessage & {
  id: string;
};

export interface AIState {
  id: string;
  model: string;
  apiKey: string;
  messages: Message[];
  cart: Cart[];
}
export interface UIState {
  isLoading: boolean;
  components: { id: string; component: ReactNode }[];
}

export interface ActionState extends AIActions {
  onSubmitForm: typeof onSubmitForm;
  addProductToCart: typeof addProductToCart;
  removeProductFromCart: typeof removeProductFromCart;
  setApiKey: typeof setApiKey;
  setModel: typeof setModel;
}

export const onSubmitForm = async (
  input: string
): Promise<{
  component: ReactNode;
  id: string;
}> => {
  "use server";

  return await streamComponent(input);
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

const setApiKey = async (apiKey: string) => {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  aiState.done({
    ...aiState.get(),
    apiKey,
  });
};

const setModel = async (model: string) => {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  aiState.done({
    ...aiState.get(),
    model,
  });
};

export const AI = createAI<AIState, UIState, ActionState>({
  initialAIState: {
    model: MODELS.at(-1)!,
    apiKey: process.env.OPENAI_API_KEY || "",
    id: nanoid(),
    messages: [],
    cart: [],
  },
  initialUIState: {
    isLoading: false,
    components: [],
  },
  actions: {
    onSubmitForm,
    addProductToCart,
    removeProductFromCart,
    setApiKey,
    setModel,
  },
});
