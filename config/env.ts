import { z } from "zod";

const env = z.object({
  OPENAI_API_KEY: z.string(),
  PORT: z.string(),
  SITE_URL: z.string().url(),
  API_URL: z.string().url(),
});

interface Env extends z.infer<typeof env> {}

if (process.env.NODE_ENV === "development") {
  env.parse(process.env);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
