import { Order } from "./order.entity";

export type CompletedOrder = Order & {
  startedAt: Date;
  completedAt: Date;
  botId: number;
};
