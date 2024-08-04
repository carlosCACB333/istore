"use server";

import { CHAT_URL } from "@/config/constants";
import { Res } from "@/types";
import { Chat } from "@/types/chat";

export const saveChat = async (state: Chat) => {
  try {
    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });

    const data = (await res.json()) as Res<Chat>;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: "FAILED",
      message: "Error al guardar el chat",
      data: {},
    } as Res<Chat>;
  }
};

export const getChat = async (id: string) => {
  try {
    const res = await fetch(`${CHAT_URL}/${id}`, {
      cache: "no-cache",
    });

    const data = (await res.json()) as Res<Chat>;
    return data;
  } catch (error) {
    return {
      status: "FAILED",
      message: "Error al buscar los productos",
      data: {},
    } as Res<Chat>;
  }
};
