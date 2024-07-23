"use server";

import { CATEGORY_URL } from "@/config/constants";
import { Res } from "@/types";
import { Category } from "@/types/product";

export const finAllCategories = async () => {
  try {
    const res = await fetch(CATEGORY_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as Res<Category[]>;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: "FAILED",
      message: "Error al buscar las categorias",
      data: [],
    } as Res<Category[]>;
  }
};
