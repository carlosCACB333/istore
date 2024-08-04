import { CoreMessage } from "ai";

export interface Chat {
  model: string;
  api_key: string;
  id: string;
  messages: Message[];
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type Message = CoreMessage & {
  id: string;
  chat_id?: string;
  created_at?: Date;
  updated_at?: Date;
};
