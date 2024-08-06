"use server";

import { NotFound } from "@/components/common/not-found";
import { CartShop } from "@/components/stream/cart-shop";
import { CartShopLoading } from "@/components/stream/cart-shop-loading";
import { CategoriesLoading } from "@/components/stream/categories-loading";
import { CategoryList } from "@/components/stream/category-list";
import { ProductDetail } from "@/components/stream/product-detail";
import { ProductList } from "@/components/stream/product-list";
import { ProductsDetailLoading } from "@/components/stream/products-detail-loading";
import { ProductsLoading } from "@/components/stream/products-loading";
import { UserMessage } from "@/components/stream/user-message";
import {
  ID_ASSIS_PREFIX,
  ID_TOOL_PREFIX,
  ID_USER_PREFIX,
  MODELS,
} from "@/config/constants";
import { MutableAIState } from "@/types";
import { createOpenAI } from "@ai-sdk/openai";
import { Spinner } from "@nextui-org/spinner";
import { APICallError } from "ai";
import { getMutableAIState, streamUI } from "ai/rsc";
import { nanoid } from "nanoid";
import { z } from "zod";
import { finAllCategories } from "./category";
import {
  findProductById,
  findProductsBycategoryId,
  searchProduct,
} from "./products";
import { AI, AIState, UIState } from "./stream-state";
import { createNewCart } from "./utils";

export const streamComponent = async (
  model = MODELS[0],
  api_key: string,
  message: string
) => {
  try {
    const aiState = getMutableAIState<typeof AI>();
    const id = nanoid();

    aiState.update({
      ...aiState.get(),
      id: aiState.get().id || id,
      api_key,
      model,
      messages: [
        ...aiState.get().messages,
        { id: ID_USER_PREFIX + id, role: "user", content: message },
      ],
    });

    const openai = createOpenAI({
      apiKey: api_key,
    });

    const result = await streamUI({
      model: openai(model as any),
      initial: <Spinner label="Estamos iniciando..." />,
      system: `\
      Esto es una tienda de productos. Necesitar matchear el input del usuario con las herramientas disponibles.
    `,
      messages: aiState.get().messages,
      toolChoice: "required",
      tools: {
        searchProduct: {
          description: "Buscador de productos",
          parameters: z.object({
            keywords: z
              .array(z.string())
              .describe(
                "Conjunto de palabras clave para buscar los productos. Incluye varios sinónimos y tambien traducciones español-inglés o inglés-español. Las oraciones debes desglosarlas en palabras clave"
              )
              .default([]),
            minPrice: z.number().optional().describe("Precio mínimo"),
            maxPrice: z.number().optional().describe("Precio máximo"),
            isOnSale: z.boolean().optional().describe("En oferta"),
            orderByDiscount: z
              .enum(["ASC", "DESC"])
              .optional()
              .describe("Ordenar por descuento"),

            orderByPrice: z
              .enum(["ASC", "DESC"])
              .optional()
              .describe("Ordenar por precio"),
            orderByDate: z
              .enum(["ASC", "DESC"])
              .optional()
              .describe("Ordenar por fecha"),
            orderByRating: z
              .enum(["ASC", "DESC"])
              .optional()
              .describe("Ordenar por rating"),
          }),
          generate: async function* (args) {
            console.info(args);
            yield (
              <UserMessage message={message} isLoading>
                <ProductsLoading />
              </UserMessage>
            );

            const res = await searchProduct(args);

            await setIAStateWithToolResult(
              aiState,
              "searchProduct",
              id,
              args,
              res.data
            );

            return (
              <UserMessage message={message} id={id}>
                <ProductList products={res.data} />
              </UserMessage>
            );
          },
        },
        findAllCategories: {
          description: "Mostrar todas las categorías",
          parameters: z.object({}),
          generate: async function* (args) {
            console.info(args);
            yield (
              <UserMessage message={message} isLoading>
                <CategoriesLoading />
              </UserMessage>
            );
            const res = await finAllCategories();

            await setIAStateWithToolResult(
              aiState,
              "findAllCategories",
              id,
              args,
              res.data
            );

            return (
              <UserMessage message={message} id={id}>
                <CategoryList categories={res.data} />
              </UserMessage>
            );
          },
        },
        findProductById: {
          description: "Buscar un producto por ID",
          parameters: z.object({
            id: z.string().describe("ID del producto"),
          }),
          generate: async function* (args) {
            console.info(args);
            yield (
              <UserMessage message={message} isLoading>
                <ProductsDetailLoading />
              </UserMessage>
            );
            const res = await findProductById(args.id);

            await setIAStateWithToolResult(
              aiState,
              "findProductById",
              id,
              args,
              res.data
            );

            return (
              <UserMessage message={message} id={id}>
                <ProductDetail product={res.data} />
              </UserMessage>
            );
          },
        },
        findProductsBycategoryId: {
          description: "Buscar productos por categoría",
          parameters: z.object({
            id: z.string().describe("ID de la categoría"),
          }),
          generate: async function* (args) {
            console.info(args);
            yield (
              <UserMessage message={message} isLoading>
                <ProductsLoading />
              </UserMessage>
            );
            const res = await findProductsBycategoryId(args.id);

            await setIAStateWithToolResult(
              aiState,
              "findProductsBycategoryId",
              id,
              args,
              res.data
            );

            return (
              <UserMessage message={message} id={id}>
                <ProductList products={res.data} />
              </UserMessage>
            );
          },
        },

        showCart: {
          description: "Mostrar el carrito de compras",
          parameters: z.object({}),
          generate: async function* (args) {
            console.info(args);
            const cart = aiState.get().cart;
            await setIAStateWithToolResult(aiState, "showCart", id, args, {
              cart,
            });
            return (
              <UserMessage message={message} id={id}>
                <CartShop items={cart} fromChat />
              </UserMessage>
            );
          },
        },

        addProductToCart: {
          description: "Agregar un producto al carrito",
          parameters: z.object({
            id: z.string().describe("ID del producto"),
            quantity: z.number().describe("Cantidad de productos").default(1),
          }),
          generate: async function* (args) {
            console.info(args);
            yield (
              <UserMessage message={message} isLoading>
                <CartShopLoading />
              </UserMessage>
            );

            const res = await findProductById(args.id);
            const newCart = createNewCart(
              aiState.get().cart,
              res.data,
              args.quantity
            );

            aiState.update({
              ...aiState.get(),
              cart: newCart,
            });

            await setIAStateWithToolResult(
              aiState,
              "addProductToCart",
              id,
              args,
              newCart
            );
            return (
              <UserMessage message={message} id={id}>
                <CartShop items={newCart} fromChat />
              </UserMessage>
            );
          },
        },

        removeProductFromCart: {
          description: "Remover un producto del carrito",
          parameters: z.object({
            id: z.number().describe("ID del producto"),
          }),
          generate: async function* (args) {
            console.info(args);
            const newCart = aiState
              .get()
              .cart.filter((item) => item.product.id !== args.id);

            aiState.update({
              ...aiState.get(),
              cart: newCart,
            });

            await setIAStateWithToolResult(
              aiState,
              "removeProductFromCart",
              id,
              args,
              newCart
            );
            return (
              <UserMessage message={message} id={id}>
                <CartShop items={newCart} fromChat />
              </UserMessage>
            );
          },
        },

        clearCart: {
          description: "Limpiar el carrito de compras",
          parameters: z.object({}),
          generate: async function* (args) {
            console.info(args);

            aiState.update({
              ...aiState.get(),
              cart: [],
            });

            await setIAStateWithToolResult(aiState, "clearCart", id, args, []);
            return (
              <UserMessage message={message} id={id}>
                <CartShop items={[]} fromChat />
              </UserMessage>
            );
          },
        },

        default: {
          description: "Si no se encuentra ninguna herramienta",
          parameters: z.object({}),
          generate: async function* (args) {
            console.info(args);
            const textResponse =
              "No pude entenderte. Intenta con otra pregunta";
            await setIAStateWithToolResult(aiState, "default", id, args, {
              id,
              message,
            });

            return (
              <UserMessage message={message} id={id}>
                <NotFound title="!Lo siento!" desc={textResponse} />
              </UserMessage>
            );
          },
        },
      },
    });

    return { component: result.value, id };
  } catch (error) {
    console.error(error);
    let msg_err = "Ocurrió un error inesperado";
    if (error instanceof APICallError) {
      if (error.statusCode === 401) {
        msg_err = "La API Key es inválida";
      }
    }
    const id = nanoid();
    return {
      component: (
        <UserMessage message={message} id={id}>
          <NotFound desc={msg_err} />
        </UserMessage>
      ),
      id: id,
    };
  }
};

const setIAStateWithToolResult = async (
  state: MutableAIState<AIState>,
  toolName: string,
  id: string,
  args: any,
  result: any
) => {
  const toolCallId = "call." + id;

  state.done({
    ...state.get(),
    messages: [
      ...state.get().messages,
      {
        id: ID_ASSIS_PREFIX + id,
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolName,
            toolCallId,
            args,
          },
        ],
      },
      {
        id: ID_TOOL_PREFIX + id,
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolName,
            toolCallId,
            result,
          },
        ],
      },
    ],
  });
};

export const getUIStateFromAIState = (aiState: AIState): UIState => {
  const components = aiState.messages
    .filter(
      (message) => message.role !== "assistant" && message.role !== "system"
    )
    .map((message, index) => {
      if (message.role !== "tool") {
        return {
          id: message.id,
          component: (
            <UserMessage message={message.content as string} id={message.id} />
          ),
        };
      }

      const content = message.content[0];

      switch (content.toolName) {
        case "searchProduct":
          return {
            id: message.id,
            component: <ProductList products={content.result as any} />,
          };
        case "findAllCategories":
          return {
            id: message.id,
            component: <CategoryList categories={content.result as any} />,
          };

        case "findProductById":
          return {
            id: message.id,
            component: <ProductDetail product={content.result as any} />,
          };

        case "findProductsBycategoryId":
          return {
            id: message.id,
            component: <ProductList products={content.result as any} />,
          };

        case "showCart":
          return {
            id: message.id,
            component: <CartShop items={content.result as any} />,
          };

        case "addProductToCart":
          return {
            id: message.id,
            component: <CartShop items={content.result as any} />,
          };

        case "removeProductFromCart":
          return {
            id: message.id,
            component: <CartShop items={content.result as any} />,
          };

        case "clearCart":
          return {
            id: message.id,
            component: <CartShop items={content.result as any} />,
          };

        case "default":
        default:
          return {
            id: message.id,
            component: (
              <NotFound
                title="!Lo siento!"
                desc="No pude entenderte. Intenta con otra pregunta"
              />
            ),
          };
      }
    });

  return {
    components,
    isLoading: false,
  };
};
