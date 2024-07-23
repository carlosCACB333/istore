"use client";
import { AI } from "@/actions/stream-state";
import { text } from "@/config/primitives";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { toast } from "sonner";
import { ArrowUp, SearchIcon } from "../common/icons";

const questions = [
  {
    title: "Productos",
    desc: "Quiero ver el catálogo de productos más nuevos",
  },
  {
    title: "Categorías",
    desc: "Quiero ver las categorías disponibles en la tienda",
  },
  {
    title: "Buscar",
    desc: "Quiero encontrar productos con más descuento y con un precio entre 1500 y 2000",
  },
  {
    title: "Sugerencias",
    desc: "Quiero encontrar los productos más valorados",
  },
];

export const InputForm = () => {
  const [uiState, setUIState] = useUIState<typeof AI>();
  const [aiState] = useAIState<typeof AI>();
  const { isLoading } = uiState;
  const { onSubmitForm } = useActions<typeof AI>();

  const handleSearch = async (search: string) => {
    if (!search) return;
    if (!aiState.apiKey.trim()) {
      return toast.error("Por favor, ingresa una API Key");
    }
    setUIState((prev) => ({ ...prev, isLoading: true }));
    const component = await onSubmitForm(search);
    setUIState((prev) => ({
      ...prev,
      isLoading: false,
      components: [...prev.components, component],
    }));
  };

  return (
    <form
      className="w-full mb-16 text-center"
      action={async (data) => {
        const search = data.get("search") as string;
        await handleSearch(search);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 ">
        {questions.map((q) => (
          <Card
            isPressable
            key={q.title}
            isDisabled={isLoading}
            onPress={async () => {
              await handleSearch(q.desc);
            }}
          >
            <CardBody className="flex-row justify-between items-center">
              <div>
                <h6 className={text({ size: "xs", font: "bold" })}>
                  {q.title}
                </h6>
                <p className={text({ size: "xs", color: "disabled" })}>
                  {q.desc}
                </p>
              </div>
              <ArrowUp />
            </CardBody>
          </Card>
        ))}
      </div>
      <Input
        isDisabled={isLoading}
        placeholder="Quiero comprar un celular"
        size="lg"
        variant="faded"
        className="placeholder:m"
        autoFocus
        classNames={{
          inputWrapper: "p-6 h-auto rounded-full bg-content1",
        }}
        name="search"
        endContent={<SearchIcon />}
        aria-label="Buscar productos"
      />

      <span className={text({ color: "disabled", size: "sm" })}>
        Empieza a escribir lo que necesitas y te ayudaremos a encontrarlo
      </span>
    </form>
  );
};
