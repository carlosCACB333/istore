import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";

export const CategoriesLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card className="w-full space-y-5 p-4" radius="lg" key={i}>
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </Card>
      ))}
    </div>
  );
};
