import { AI } from "@/actions/stream-state";
import "@/config/env";
import { text } from "@/config/primitives";
import { AIProvider } from "@/stores/ai";
import "@/styles/globals.css";

export default async function StreamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] gap-8">
      <div className="text-center">
        <h1 className={text({ size: "2xl", class: "text-balance" })}>
          <span className={text({ size: "2xl", color: "blue" })}>
            IntelliStores:{" "}
          </span>
          Tu tienda inteligente potenciado por
          <span className={text({ size: "2xl", color: "blue" })}> IA. </span>
        </h1>
        <br />
        <p
          className={text({
            size: "md",
            color: "disabled",
            class: "text-balance",
          })}
        >
          IntelliStores es el e-commerce 100% impulsado por inteligencia
          artificial. Disfruta de recomendaciones personalizadas y ofertas
          exclusivas. ¡Revoluciona tu manera de comprar!
        </p>
      </div>

      <AI>
        <AIProvider apiKey={process.env.OPENAI_API_KEY}>{children}</AIProvider>
      </AI>
    </div>
  );
}
