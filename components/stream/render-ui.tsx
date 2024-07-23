"use client";

import { AI } from "@/actions/stream-state";
import { Divider } from "@nextui-org/divider";
import { useUIState } from "ai/rsc";
import { useEffect } from "react";

export const RenderUI = () => {
  const [{ components }] = useUIState<typeof AI>();

  useEffect(() => {
    const top = document.body.scrollHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }, [components]);

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
