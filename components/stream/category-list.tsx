"use client";

import { AI } from "@/actions/stream-state";
import { useAI } from "@/stores/ai";
import { Category } from "@/types/product";
import { Card, CardHeader } from "@nextui-org/card";
import { useActions, useUIState } from "ai/rsc";
import { toast } from "sonner";
import { NotFound } from "../common/not-found";

interface Props {
  categories?: Category[];
}

export const CategoryList = ({ categories = [] }: Props) => {
  const { onSubmitForm } = useActions<typeof AI>();
  const [_, setUIState] = useUIState<typeof AI>();
  const { api_key, model } = useAI();

  if (categories.length === 0) return <NotFound />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2">
        {categories.map((category) => (
          <Card
            key={category.id}
            isPressable
            className="w-full"
            onClick={async () => {
              if (!api_key.current.trim()) {
                return toast.error("Por favor, ingresa una API Key");
              }
              setUIState((prev) => ({ ...prev, isLoading: true }));
              const component = await onSubmitForm(
                model.current,
                api_key.current,
                "Productos de la categoría con id: " + category.id
              );
              setUIState((prev) => ({
                ...prev,
                isLoading: false,
                components: [...prev.components, component],
              }));
            }}
          >
            <CardHeader
              className="z-10 top-1 flex-col !items-start text-start"
              style={{
                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="text-white text-lg font-bold">{category.name}</p>
              <p className="text-white text-sm">{category.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};
