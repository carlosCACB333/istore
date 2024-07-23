import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

type AIAction<T = any, R = any> = (...args: T[]) => Promise<R>;
export type AIActions<T = any, R = any> = Record<string, AIAction<T, R>>;

export type Status = "SUCCESS" | "FAILED";

export interface Res<T extends Record<string, any> = Record<string, any>> {
  status: Status;
  message: string;
  data: T;
}

type ValueOrUpdater<T> = T | ((current: T) => T);

export type MutableAIState<AIState> = {
  get: () => AIState;
  update: (newState: ValueOrUpdater<AIState>) => void;
  done: ((newState: AIState) => void) | (() => void);
};
