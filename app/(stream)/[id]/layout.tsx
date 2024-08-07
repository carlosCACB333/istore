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
        case "searchProduct": {
          const { data } = await searchProduct(content.args);
          addToolMsg(data);
          break;
        }
        case "findAllCategories": {
          const { data } = await finAllCategories();
          addToolMsg(data);
          break;
        }
        case "findProductById": {
          const { data } = await findProductById(content.args.id);
          addToolMsg(data);
          break;
        }
        case "findProductsBycategoryId": {
          const { data } = await findProductsBycategoryId(content.args.id);
          addToolMsg(data);
          break;
        }
        case "showCart":
        case "addProductToCart":
        case "removeProductFromCart":
        case "clearCart": {
          messages.pop();
          messages.pop();
          break;
        }
      }
    }
  }
  return (
    <AI
      initialAIState={{
        ...data,
        messages: messages,
        cart: [],
      }}
    >
      {children}
      <InputForm />
    </AI>
  );
};

export default ChatLayout;
