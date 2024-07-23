"use server";

import { NotFound } from "@/components/common/not-found";
import { BotTextMessage } from "@/components/stream/bot-text-message";
import { CartShop } from "@/components/stream/cart-shop";
import { CartShopLoading } from "@/components/stream/cart-shop-loading";
import { CategoriesLoading } from "@/components/stream/categories-loading";
import { CategoryList } from "@/components/stream/category-list";
import { ProductDetail } from "@/components/stream/product-detail";
import { ProductList } from "@/components/stream/product-list";
import { ProductsDetailLoading } from "@/components/stream/products-detail-loading";
import { ProductsLoading } from "@/components/stream/products-loading";
import { ResponseLayout } from "@/components/stream/response-layout";
import {
  ID_ASSISTANT_SUFFIX,
  ID_TOOL_SUFFIX,
  ID_USE_SUFFIX,
  MODELS,
} from "@/config/constants";
import { MutableAIState } from "@/types";
import { createOpenAI } from "@ai-sdk/openai";
import { Spinner } from "@nextui-org/spinner";
import { APICallError } from "ai";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { nanoid } from "nanoid";
import { z } from "zod";
import { finAllCategories } from "./category";
import {
  findProductById,
  findProductsBycategoryId,
  searchProduct,
} from "./products";
import { AI, AIState } from "./stream-state";
import { createNewCart } from "./utils";

export const streamComponent = async (message: string) => {
  try {
    let textStream:
      | undefined
      | ReturnType<typeof createStreamableValue<string>>;
    let textNode: undefined | React.ReactNode;
    const aiState = getMutableAIState<typeof AI>();
    const id = nanoid();

    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: id + ID_USE_SUFFIX, role: "user", content: message },
      ],
    });

    const openai = createOpenAI({
      apiKey: aiState.get().apiKey,
    });

    const result = await streamUI({
      model: openai((aiState.get().model || MODELS[0]) as any),
      initial: <Spinner label="Estamos iniciando..." />,
      system: `\
    Eres un vendedor de productos y necesitas ayuda para responder a tus clientes.
    No repondas a preguntas que no tienen un tool asociado,en ese caso responde: "No pude entenderte. Intenta con otra pregunta". Pero si puedes saludar o mostrar información sobre ti.
    `,
      messages: aiState.get().messages,
      text: ({ content, done, delta }) => {
        if (!textStream) {
          textStream = createStreamableValue("");
          textNode = (
            <ResponseLayout message={message} id={id}>
              <BotTextMessage content={textStream.value} />
            </ResponseLayout>
          );
        }

        if (done) {
          textStream.done();
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: id + ID_ASSISTANT_SUFFIX,
                role: "assistant",
                content,
              },
            ],
          });
        } else {
          textStream.update(delta);
        }

        return textNode;
      },
      tools: {
        searchProduct: {
          description: "Buscador de productos",
          parameters: z.object({
            keywords: z
              .array(z.string())
              .describe("Palabras clave de una sola palabra con sus sinónimos")
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
            console.log(args);
            yield (
              <ResponseLayout message={message} isLoading>
                <ProductsLoading />
              </ResponseLayout>
            );
            const res = await searchProduct(args);

            setIAStateWithToolResult(aiState, "searchProduct", id, args, {
              products: res.data,
            });

            return (
              <ResponseLayout message={message} id={id}>
                <ProductList products={res.data} />
              </ResponseLayout>
            );
          },
        },
        findAllCategories: {
          description: "Mostrar todas las categorías",
          parameters: z.object({}),
          generate: async function* (args) {
            yield (
              <ResponseLayout message={message} isLoading>
                <CategoriesLoading />
              </ResponseLayout>
            );
            const res = await finAllCategories();

            setIAStateWithToolResult(aiState, "findAllCategories", id, args, {
              categories: res.data,
            });

            return (
              <ResponseLayout message={message} id={id}>
                <CategoryList categories={res.data} />
              </ResponseLayout>
            );
          },
        },
        findProductById: {
          description: "Buscar un producto por ID",
          parameters: z.object({
            id: z.string().describe("ID del producto"),
          }),
          generate: async function* (args) {
            yield (
              <ResponseLayout message={message} isLoading>
                <ProductsDetailLoading />
              </ResponseLayout>
            );
            const res = await findProductById(args.id);

            setIAStateWithToolResult(aiState, "findProductById", id, args, {
              product: res.data,
            });

            return (
              <ResponseLayout message={message} id={id}>
                <ProductDetail product={res.data} />
              </ResponseLayout>
            );
          },
        },
        findProductsBycategoryId: {
          description: "Buscar productos por categoría",
          parameters: z.object({
            id: z.string().describe("ID de la categoría"),
          }),
          generate: async function* (args) {
            yield (
              <ResponseLayout message={message} isLoading>
                <ProductsLoading />
              </ResponseLayout>
            );
            const res = await findProductsBycategoryId(args.id);

            setIAStateWithToolResult(
              aiState,
              "findProductsBycategoryId",
              id,
              args,
              { products: res.data }
            );

            return (
              <ResponseLayout message={message} id={id}>
                <ProductList products={res.data} />
              </ResponseLayout>
            );
          },
        },

        showCart: {
          description: "Mostrar el carrito de compras",
          parameters: z.object({}),
          generate: async function* (args) {
            const cart = aiState.get().cart;
            setIAStateWithToolResult(aiState, "showCart", id, args, {
              cart,
            });
            return (
              <ResponseLayout message={message} id={id}>
                <CartShop items={cart} fromChat />
              </ResponseLayout>
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
            yield (
              <ResponseLayout message={message} isLoading>
                <CartShopLoading />
              </ResponseLayout>
            );

            const res = await findProductById(args.id);
            const newCart = createNewCart(
              aiState.get().cart,
              res.data,
              args.quantity
            );

            aiState.done({
              ...aiState.get(),
              cart: newCart,
            });

            setIAStateWithToolResult(
              aiState,
              "addProductToCart",
              id,
              args,
              newCart
            );
            return (
              <ResponseLayout message={message} id={id}>
                <CartShop items={newCart} fromChat />
              </ResponseLayout>
            );
          },
        },

        removeProductFromCart: {
          description: "Remover un producto del carrito",
          parameters: z.object({
            id: z.number().describe("ID del producto"),
          }),
          generate: async function* (args) {
            const newCart = aiState
              .get()
              .cart.filter((item) => item.product.id !== args.id);

            aiState.done({
              ...aiState.get(),
              cart: newCart,
            });

            setIAStateWithToolResult(
              aiState,
              "removeProductFromCart",
              id,
              args,
              newCart
            );
            return (
              <ResponseLayout message={message} id={id}>
                <CartShop items={newCart} fromChat />
              </ResponseLayout>
            );
          },
        },

        clearCart: {
          description: "Limpiar el carrito de compras",
          parameters: z.object({}),
          generate: async function* (args) {
            aiState.done({
              ...aiState.get(),
              cart: [],
            });

            setIAStateWithToolResult(aiState, "clearCart", id, args, {
              cart: [],
            });
            return (
              <ResponseLayout message={message} id={id}>
                <CartShop items={[]} fromChat />
              </ResponseLayout>
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
        <ResponseLayout message={message} id={id}>
          <NotFound desc={msg_err} />
        </ResponseLayout>
      ),
      id: id,
    };
  }
};

const setIAStateWithToolResult = (
  state: MutableAIState<AIState>,
  toolName: string,
  id: string,
  args: any,
  result: any
) => {
  const toolCallId = id + "_tool_call_id";

  state.done({
    ...state.get(),
    messages: [
      ...state.get().messages,
      {
        id: id + ID_ASSISTANT_SUFFIX,
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
        id: id + ID_TOOL_SUFFIX,
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
