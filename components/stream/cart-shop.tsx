"use client";
import { AI } from "@/actions/stream-state";
import { text } from "@/config/primitives";
import { Cart } from "@/types/product";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { useActions } from "ai/rsc";
import { Close, Shop } from "../common/icons";

interface Props {
  items?: Cart[];
  fromChat?: boolean;
}

export const CartShop = ({ items = [], fromChat = false }: Props) => {
  const { removeProductFromCart } = useActions<typeof AI>();
  const total = items
    .reduce((acc, item) => {
      return acc + Number(item.product.price) * item.quantity;
    }, 0)
    .toFixed(2);

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[200px]">
        <Shop size={60} className="text-default" />
        <h3 className={text({ font: "bold", color: "disabled" })}>
          ¡Tu carrito está vacío!
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.product.id}>
            <div className="flex gap-4 items-center">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1">
                <h4 className={text({ font: "bold" })}>{item.product.name}</h4>
                <p>
                  <span className={text({ color: "disabled" })}>
                    Cantidad:{" "}
                  </span>
                  {item.quantity}
                </p>
                <p>
                  <span className={text({ color: "disabled" })}>Precio: </span>$
                  {item.product.price}
                </p>
              </div>
              <div>
                <p className={text({ font: "bold" })}>
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>
              </div>
              {!fromChat && (
                <div>
                  <Button
                    isIconOnly
                    className="rounded-full bg-default-50"
                    size="sm"
                    onClick={async () => {
                      await removeProductFromCart(item.product);
                    }}
                    aria-label="Eliminar"
                  >
                    <Close />
                  </Button>
                </div>
              )}
            </div>
            <Divider className="mt-2" />
          </div>
        ))}

        <div className="flex justify-between">
          <h3 className={text({ font: "bold" })}>Total:</h3>
          <h3 className={text({ font: "bold" })}>${total}</h3>
        </div>
      </div>
    </div>
  );
};
