export const PRODUCT_URL = process.env.API_URL + "/api/products";
export const CATEGORY_URL = process.env.API_URL + "/api/categories";
export const CHAT_URL = process.env.API_URL + "/api/chat";
export const ID_USER_PREFIX = "user.";
export const ID_ASSIS_PREFIX = "assis.";
export const ID_TOOL_PREFIX = "tool.";
export const __PROD__ = process.env.NODE_ENV === "production";

export const MODELS = [
  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",
];

export const getAiIds = (id: string) => {
  id = id.split(".").at(-1)!;
  return [ID_USER_PREFIX + id, ID_ASSIS_PREFIX + id, ID_TOOL_PREFIX + id];
};

export const getuiIds = (id: string) => {
  id = id.split(".").at(-1)!;
  return [id, ID_USER_PREFIX + id, ID_TOOL_PREFIX + id];
};
