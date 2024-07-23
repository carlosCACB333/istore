import { MoodPuzzled } from "@/components/common/icons";
import { text } from "@/config/primitives";

interface Props {
  title?: string;
  desc?: string;
}

export const NotFound = ({
  title = "¡Ups!",
  desc = "Lo sentimos, no pudimos encontrar lo que buscabas.",
}: Props) => {
  return (
    <div className="flex gap-2 justify-center items-center min-h-20">
      <div>
        <MoodPuzzled size={60} className={text({ color: "disabled" })} />
      </div>
      <div className="border-l-2 pl-2">
        <h1 className={text({ size: "md", font: "bold" })}>{title}</h1>
        <p className={text({ color: "disabled" })}>{desc}</p>
      </div>
    </div>
  );
};
