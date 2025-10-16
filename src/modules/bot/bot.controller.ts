import { PendingQueue } from "../../helpers/pending-queue";
import { BotService } from "./bot.service";
import { Order } from "../../entities/order.entity";
import { CompletedOrder } from "../../entities/completed-order.entity";
import { ControllerState } from "../../entities/controller-state.entity";

export class BotController {
  private readonly queue = new PendingQueue();
  private readonly bots = new Map<number, BotService>();
  private nextOrderId = 1;
  private readonly completed: CompletedOrder[] = [];
  private logger?: (message: string) => void;

  constructor(logger?: (message: string) => void) {
    this.logger = logger;
  }

  createNormalOrder(): Order {
    const order: Order = {
      id: this.nextOrderId++,
      isVip: false,
      createdAt: new Date(),
    };
    this.queue.enqueue(order);
    this.logger?.(`Enqueued NORMAL order #${order.id}`);
    this.kickBots();
    return order;
  }

  createVipOrder(): Order {
    const order: Order = {
      id: this.nextOrderId++,
      isVip: true,
      createdAt: new Date(),
    };
    for (const bot of this.bots.values()) {
      const cur = bot.getCurrentOrder();
      if (cur && !cur.isVip) {
        bot.stop();
        break;
      }
    }
    this.queue.enqueue(order);
    this.logger?.(`Enqueued VIP order #${order.id}`);
    this.kickBots();
    return order;
  }

  addBot(processingMs?: number): number {
    let id = 1;
    while (this.bots.has(id)) id++;
    const bot = new BotService(
      id,
      {
        onCompleted: (co) => this.onCompleted(co),
        onStopped: (orderReturned) => this.onBotStopped(id, orderReturned),
      },
      processingMs
    );
    this.bots.set(id, bot);
    this.logger?.(`Added bot #${id}`);
    this.kickBots();
    return id;
  }

  removeBot(): number | undefined {
    if (this.bots.size === 0) {
      this.logger?.("No bots available to remove");
      return undefined;
    }
    const newestId = Math.max(...this.bots.keys());
    const bot = this.bots.get(newestId)!;
    bot.stop();
    this.bots.delete(newestId);
    this.logger?.(`Removed bot #${newestId}`);
    return newestId;
  }

  getState(): ControllerState {
    const activeBotIds = Array.from(this.bots.keys()).sort((a, b) => a - b);
    const busyBotIds = activeBotIds.filter((id) => this.bots.get(id)!.isBusy());
    return {
      pendingVipCount: this.queue.vipSize(),
      pendingNormalCount: this.queue.normalSize(),
      activeBotIds,
      busyBotIds,
      completedCount: this.completed.length,
    };
  }

  getCompleted(): CompletedOrder[] {
    return [...this.completed];
  }

  private kickBots(): void {
    for (const bot of this.bots.values()) {
      if (!bot.isBusy()) {
        const next = this.queue.dequeue();
        if (next) {
          const started = bot.tryStart(next);
          if (started) {
            const type = next.isVip ? "VIP" : "NORMAL";
            this.logger?.(
              `Processing ${type} order #${next.id} on bot #${bot.id}`
            );
          }
        }
      }
    }
  }

  private onCompleted(co: CompletedOrder): void {
    this.completed.push(co);
    this.kickBots();
    const type = co.isVip ? "VIP" : "NORMAL";
    this.logger?.(`Completed ${type} order #${co.id} by bot #${co.botId}`);
  }

  private onBotStopped(botId: number, orderReturned?: Order): void {
    if (orderReturned) {
      this.queue.enqueue(orderReturned);
      const type = orderReturned.isVip ? "VIP" : "NORMAL";
      this.logger?.(`Returned ${type} order #${orderReturned.id} to queue`);
    }
  }
}
