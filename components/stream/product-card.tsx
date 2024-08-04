"use client";
import { AI } from "@/actions/stream-state";
import { text } from "@/config/primitives";
import { useAI } from "@/stores/ai";
import { Product } from "@/types/product";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useActions, useUIState } from "ai/rsc";
import { toast } from "sonner";
import { Rating } from "../ui/rating";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const { onSubmitForm, addProductToCart } = useActions<typeof AI>();
  const [uiState, setUIState] = useUIState<typeof AI>();
  const { api_key, model } = useAI();

  const discount = Math.round(
    ((Number(product.original_price) - Number(product.price)) /
      Number(product.original_price)) *
      100
  );
  return (
    <Card key={product.id} isFooterBlurred className="w-full">
      <CardBody className="gap-4 relative">
        {discount > 0 && (
          <div className="absolute z-30 top-2 right-2 bg-danger text-white rounded-lg p-1">
            -{discount}%
          </div>
        )}
        <Image
          removeWrapper
          alt={product.name}
          className="w-full object-cover h-[140px]"
          src={product.images[0]}
        />

        <div className="flex justify-between">
          <h4 className={text({ size: "sm", font: "bold" })}>{product.name}</h4>
          <p className={text({ size: "sm", font: "bold" })}>${product.price}</p>
        </div>
        <p
          className={text({
            size: "xs",
            color: "disabled",
            className: "line-clamp-4 text-balance",
          })}
        >
          {product.description}
        </p>

        <Rating rating={Number(product.rating)} />
      </CardBody>
      <CardFooter className="gap-2">
        <Button
          className="w-full"
          size="sm"
          isDisabled={uiState.isLoading}
          onClick={async () => {
            if (!api_key.current.trim()) {
              return toast.error("Por favor, ingresa una API Key");
            }
            setUIState((prev) => ({ ...prev, isLoading: true }));
            const component = await onSubmitForm(
              model.current,
              api_key.current,
              "Detalle del producto con id: " + product.id
            );
            setUIState((prev) => ({
              ...prev,
              isLoading: false,
              components: [...prev.components, component],
            }));
          }}
          aria-label="Ver más"
        >
          Ver más
        </Button>

        <Button
          className="w-full"
          color="primary"
          size="sm"
          onClick={async () => {
            await addProductToCart(product, 1);
            toast.success("Producto agregado al carrito");
          }}
          aria-label="Agregar al carrito"
        >
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
};
