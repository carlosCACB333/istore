import { Cart, Product } from "@/types/product";

export const createNewCart = (
  cart: Cart[],
  product: Product,
  quantity: number
) => {
  let isInCart = false;
  const newCart = cart.map((item) => {
    if (item.product.id === product.id) {
      isInCart = true;
      const newQuantity = item.quantity + quantity;
      return { product, quantity: Math.min(newQuantity, product.stock) };
    }
    return item;
  });
  if (!isInCart) {
    newCart.push({ product, quantity: Math.min(quantity, product.stock) });
  }

  return newCart;
};
