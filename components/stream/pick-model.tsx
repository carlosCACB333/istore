"use client";

import { AI } from "@/actions/stream-state";
import { MODELS } from "@/config/constants";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useActions, useAIState } from "ai/rsc";

export const PickModel = () => {
  const { setApiKey, setModel } = useActions<typeof AI>();
  const [aiState] = useAIState<typeof AI>();
  return (
    <div className="flex justify-center gap-2 mt-1">
      <Select
        size="sm"
        variant="bordered"
        defaultSelectedKeys={[MODELS.at(-1)!]}
        aria-label="Modelo de IA"
        onChange={(model) => setModel(model.target.value)}
      >
        {MODELS.map((model, i) => (
          <SelectItem key={model}>{model}</SelectItem>
        ))}
      </Select>
      <Input
        size="sm"
        variant="bordered"
        type="password"
        placeholder="Api Key"
        aria-label="Api Key"
        onChange={(key) => setApiKey(key.target.value)}
        defaultValue={aiState.apiKey}
      />
    </div>
  );
};
