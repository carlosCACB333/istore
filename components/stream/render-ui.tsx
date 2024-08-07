"use client";

import { AI } from "@/actions/stream-state";
import { Divider } from "@nextui-org/divider";
import { useUIState } from "ai/rsc";

export const RenderUI = () => {
  const [{ components }] = useUIState<typeof AI>();

  return (
    <div className="w-full mb-4">
      {components.map((m) => (
        <div key={m.id}>
          {m.component}
          <Divider className="mb-8 mt-4" />
        </div>
      ))}
    </div>
  );
};
