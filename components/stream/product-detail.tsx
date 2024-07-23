"use client";

import { AI } from "@/actions/stream-state";
import { text } from "@/config/primitives";
import { ProductFull } from "@/types/product";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { useActions } from "ai/rsc";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { HeartFilledIcon } from "../common/icons";
import { NotFound } from "../common/not-found";
import { Rating } from "../ui/rating";

interface Props {
  product?: ProductFull;
}

export const ProductDetail = ({ product }: Props) => {
  const [image, setImage] = useState(product?.images[0]);
  const [count, setCount] = useState(1);
  const { addProductToCart } = useActions<typeof AI>();

  if (!product) return <NotFound />;

  const discount = Math.round(
    ((Number(product.original_price) - Number(product.price)) /
      Number(product.original_price)) *
      100
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex gap-2">
        <div className="flex flex-col gap-2 overflow-auto px-1 max-h-[500px]">
          {product.images.map((img) => (
            <Image
              key={img}
              src={img}
              alt={product.name}
              className="object-cover w-16 h-16 aspect-square cursor-pointer"
              onClick={() => setImage(img)}
            />
          ))}
        </div>
        <Image
          removeWrapper
          src={image}
          alt={product.name}
          className="aspect-square object-cover max-h-[500px]  flex-1 "
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {discount > 0 && (
              <span className="right-2 bg-danger text-white rounded-lg p-1">
                -{discount}%
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <p className={text({ font: "bold" })}>${product.price}</p>
            {discount > 0 && (
              <span
                className={text({
                  class: "line-through",
                  color: "disabled",
                })}
              >
                ${product.original_price}
              </span>
            )}
          </div>
        </div>

        {product.categories && (
          <div className="flex gap-2">
            {product.categories.map((category) => (
              <Chip key={category.id} variant="flat" size="sm" color="primary">
                {category.name}
              </Chip>
            ))}
          </div>
        )}
        <p className="text-lg">{product.description}</p>
        <Rating rating={Number(product.rating)} />
        {product.colors && (
          <RadioGroup orientation="horizontal">
            {product.colors.map((color) => (
              <Radio
                key={color.color}
                value={color.color}
                style={{
                  backgroundColor: color.hex,
                }}
                classNames={{
                  base: clsx(
                    `inline-flex m-0  bg-content2 items-center justify-between`,
                    " cursor-pointer rounded-lg gap-0 p-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "p-0",
                }}
              >
                {color.color}
              </Radio>
            ))}
          </RadioGroup>
        )}

        {product.sizes && (
          <RadioGroup orientation="horizontal">
            {product.sizes.map((size) => (
              <Radio key={size.size} value={size.size}>
                {size.size}
              </Radio>
            ))}
          </RadioGroup>
        )}

        <div>
          <ButtonGroup className="space-x-1 mr-2">
            <Button
              onClick={() => setCount(Math.max(1, count - 1))}
              aria-label="Restar"
            >
              -
            </Button>
            <Button aria-label="Cantidad">{count}</Button>
            <Button
              aria-label="Sumar"
              onClick={() => setCount(Math.min(product.stock, count + 1))}
            >
              +
            </Button>
          </ButtonGroup>
          <span className="text-tiny">Máximo {product.stock} unidades</span>
        </div>

        <div className="flex-1"></div>
        <div className="flex gap-2">
          <Button
            size="lg"
            color="primary"
            fullWidth
            onClick={async () => {
              await addProductToCart(product, count);
              toast.success("Producto agregado al carrito");
            }}
          >
            Agregar al carrito
          </Button>
          <Button isIconOnly size="lg" aria-label="Favorito">
            <HeartFilledIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
