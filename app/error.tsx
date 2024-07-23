"use client";

import { Button } from "@nextui-org/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2>Ocurrió un error inesperado</h2>
      <Button onClick={() => reset()} aria-label="Intentar de nuevo">
        Intentar de nuevo
      </Button>
    </div>
  );
}
