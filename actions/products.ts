"use server";

import { PRODUCT_URL } from "@/config/constants";
import { Res } from "@/types";
import { Product, ProductFull } from "@/types/product";

type Order = "ASC" | "DESC";

interface ProductBody {
  keywords: string[];
  minPrice?: Number;
  maxPrice?: Number;
  isOnSale?: boolean;
  orderByPrice?: Order;
  orderByDate?: Order;
  orderByRating?: Order;
  orderByDiscount?: Order;
}

export const searchProduct = async (body: ProductBody) => {
  try {
    const res = await fetch(PRODUCT_URL + "/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: body.keywords,
        min_price: body.minPrice,
        max_price: body.maxPrice,
        is_on_sale: body.isOnSale,
        order_by_price: body.orderByPrice,
        order_by_date: body.orderByDate,
        order_by_rating: body.orderByRating,
        order_by_discount: body.orderByDiscount,
      }),
    });

    const data = (await res.json()) as Res<Product[]>;
    return data;
  } catch (error) {
    return {
      status: "FAILED",
      message: "Error al buscar los productos",
      data: [],
    } as Res<Product[]>;
  }
};

export const findProductById = async (id: string) => {
  try {
    const res = await fetch(PRODUCT_URL + "/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as Res<ProductFull>;
    return data;
  } catch (error) {
    return {
      status: "FAILED",
      message: "Error al buscar los productos",
      data: {} as ProductFull,
    } as Res<ProductFull>;
  }
};

export const findProductsBycategoryId = async (id: string) => {
  try {
    const res = await fetch(PRODUCT_URL + "/category/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as Res<Product[]>;
    return data;
  } catch (error) {
    return {
      status: "FAILED",
      message: "Error al buscar los productos",
      data: [],
    } as Res<Product[]>;
  }
};
