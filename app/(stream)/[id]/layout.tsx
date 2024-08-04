import { finAllCategories } from "@/actions/category";
import { getChat } from "@/actions/chat";
import {
  findProductById,
  findProductsBycategoryId,
  searchProduct,
} from "@/actions/products";
import { AI } from "@/actions/stream-state";
import { InputForm } from "@/components/stream/input-form";
import { ID_ASSIS_PREFIX, ID_TOOL_PREFIX } from "@/config/constants";
import { Message } from "@/types/chat";
import { notFound } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

const ChatLayout = async ({ params, children }: Props) => {
  const { data, status } = await getChat(params.id);

  if (status === "FAILED") {
    notFound();
  }

  const messages: Message[] = [];

  for (const message of data.messages) {
    messages.push(message);
    if (message.role === "assistant") {
      const content = message.content[0] as any;
      const addToolMsg = (result: Record<string, any>) => {
        const msg: Message = {
          id: ID_TOOL_PREFIX + message.id.replace(ID_ASSIS_PREFIX, ""),
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: content.toolName,
              toolCallId: content.toolCallId,
              result: result,
            },
          ],
        };
        messages.push(msg);
      };

      switch (content.toolName) {
        case "searchProduct":
          const { data: products } = await searchProduct(content.args);
          addToolMsg(products);
          break;
        case "findAllCategories":
          const { data: categories } = await finAllCategories();
          addToolMsg(categories);
          break;
        case "findProductById":
          const { data: product } = await findProductById(content.args.id);
          addToolMsg(product);
          break;
        case "findProductsBycategoryId":
          const { data: productsByCategory } = await findProductsBycategoryId(
            content.args.id
          );
          addToolMsg(productsByCategory);
          break;
        case "showCart":
          break;
        case "addProductToCart":
          break;
        case "removeProductFromCart":
          break;
        case "clearCart":
          break;
        case "default":
          addToolMsg({});
          break;
      }
    }
  }
  return (
    <AI
      initialAIState={{
        ...data,
        messages: messages,
        cart: [],
        saveState: "RESTORED",
      }}
    >
      {children}
      <InputForm />
    </AI>
  );
};

export default ChatLayout;
