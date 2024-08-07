"use client";
import { AI } from "@/actions/stream-state";
import { MODELS } from "@/config/constants";
import { text } from "@/config/primitives";
import { useScroll } from "@/hooks/use-scroll";
import { useAI } from "@/stores/ai";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { ArrowUp, DotsVertical, SearchIcon } from "../common/icons";

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
  const { onSubmitForm, resetAIState } = useActions<typeof AI>();
  const [aiState] = useAIState<typeof AI>();
  const { api_key, model, isMenuOpen, setIsMenuOpen } = useAI();
  const router = useRouter();
  const { visibilityRef } = useScroll();
  const formRef = useRef<HTMLFormElement>(null);
  const { isLoading } = uiState;

  const handleSearch = async (search: string) => {
    if (!search) return;

    if (!api_key.current.trim()) {
      toast.error("Por favor, ingresa una API Key");
      setIsMenuOpen(true);
      return;
    }

    setUIState((prev) => ({ ...prev, isLoading: true }));
    const component = await onSubmitForm(
      model.current,
      api_key.current,
      search
    );
    setUIState((prev) => ({
      ...prev,
      isLoading: false,
      components: [...prev.components, component],
    }));

    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
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
      <div className="flex items-center gap-2">
        <Input
          isDisabled={isLoading}
          placeholder="Quiero comprar un celular"
          size="lg"
          variant="faded"
          className="flex-1"
          autoFocus
          classNames={{
            inputWrapper: "p-6 h-auto rounded-full bg-content1",
          }}
          name="search"
          endContent={<SearchIcon />}
          aria-label="Buscar productos"
          maxLength={100}
        />

        <Dropdown
          showArrow
          isOpen={isMenuOpen}
          backdrop="opaque"
          onOpenChange={(e) => {
            setIsMenuOpen(e);
          }}
        >
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <DotsVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Configuración del modelo"
            onAction={async (e) => {
              switch (e) {
                case "clear": {
                  await resetAIState();
                  setUIState((prev) => ({
                    ...prev,
                    components: [],
                  }));
                  break;
                }
                case "save": {
                  const { id } = aiState;
                  if (!id) return;
                  router.push("/" + id);
                  break;
                }
              }
              setIsMenuOpen(false);
            }}
          >
            <DropdownSection showDivider title="Configuración">
              <DropdownItem
                key="model"
                isReadOnly
                classNames={{
                  title: "flex-[initial]",
                }}
                endContent={
                  <select
                    className="flex-1 border-medium p-1 rounded-md border-default-300"
                    onChange={(e) => {
                      model.current = e.target.value;
                    }}
                  >
                    {MODELS.map((model) => (
                      <option key={model} aria-label={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                }
              >
                Modelo:
              </DropdownItem>
              <DropdownItem key="api-key" isReadOnly>
                <Input
                  labelPlacement="outside-left"
                  label="Api Key: "
                  size="sm"
                  variant="bordered"
                  type="password"
                  placeholder="Api Key"
                  aria-label="Api Key"
                  onChange={(key) => (api_key.current = key.target.value)}
                  defaultValue={api_key.current}
                />
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Acciones">
              <DropdownItem key="save">Guardar resultado</DropdownItem>
              <DropdownItem key="clear">Limpiar resultado</DropdownItem>
              <DropdownItem
                key="close"
                color="danger"
                className="text-danger-500"
              >
                Cerrar
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
      <span className={text({ color: "disabled", size: "xs" })}>
        Empieza a escribir lo que necesitas y te ayudaremos a encontrarlo
      </span>
      <div ref={visibilityRef} />
    </form>
  );
};
