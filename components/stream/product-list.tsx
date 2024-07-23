
import { Product } from "@/types/product";
import { NotFound } from "../common/not-found";
import { ProductCard } from "./product-card";

interface Props {
  products?: Product[];
}

export const ProductList = ({ products = [] }: Props) => {
  if (products.length === 0) return <NotFound />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
