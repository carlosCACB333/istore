import { Start } from "@/components/common/icons";
import { text } from "@/config/primitives";

interface Props {
  rating: number;
}

export const Rating = ({ rating }: Props) => {
  let rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Start
          key={star}
          size={18}
          className={star <= rounded ? "text-primary" : "text-disabled"}
        />
      ))}
      <span className={text({ size: "xs", color: "disabled" })}>
        ({rating})
      </span>
    </div>
  );
};
