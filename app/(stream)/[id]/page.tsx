import { RenderUI } from "@/components/stream/render-ui";

interface Props {
  params: {
    id: string;
  };
}

export default function Home(pros: Props) {
  const id = pros.params.id;

  return (
    <>
      <RenderUI />
    </>
  );
}
