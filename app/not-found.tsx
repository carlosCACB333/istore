import { NotFound } from "@/components/common/not-found";

const NotFoundPage = () => {
  return (
    <div className="h-[60dvh] flex justify-center">
      <NotFound desc="Esta página no existe" />
    </div>
  );
};

export default NotFoundPage;
