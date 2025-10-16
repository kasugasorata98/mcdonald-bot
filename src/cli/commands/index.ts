import { CommandContext, CommandHandler } from "./types";
import { handleOrder } from "./order";
import { handleAddBot, handleRemoveBot } from "./bots";
import { handleState } from "./state";

export const registry: Record<string, CommandHandler> = {
  state: handleState,
  "+bot": handleAddBot,
  "-bot": handleRemoveBot,
  order: handleOrder,
  create: handleOrder,
  new: (ctx) => handleOrder(ctx, ["order", "normal"]),
  vip: (ctx) => handleOrder(ctx, ["order", "vip"]),
  add: (ctx, parts) => {
    if (parts[1] === "bot") return handleAddBot(ctx, parts);
    ctx.log("Usage: add bot");
  },
  remove: (ctx, parts) => {
    if (parts[1] === "bot") return handleRemoveBot(ctx, parts);
    ctx.log("Usage: remove bot");
  },
  help: (ctx) => {
    ctx.log(
      "Commands: help | order normal | order vip | +bot | -bot | state | quit"
    );
  },
};

export function executeCommand(ctx: CommandContext, input: string): void {
  const parts = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return;
  const cmd = parts[0];
  if (cmd === "quit" || cmd === "exit") {
    const s = ctx.controller.getState();
    ctx.log(
      `Final state | PENDING vip=${s.pendingVipCount} normal=${s.pendingNormalCount} | BOTS active=${s.activeBotIds.length} busy=${s.busyBotIds.length} | COMPLETE=${s.completedCount}`
    );
    // eslint-disable-next-line no-process-exit
    setTimeout(() => process.exit(0), 200);
    return;
  }
  const handler = registry[cmd];
  if (!handler) {
    ctx.log("Unknown command. Type 'help'.");
    return;
  }
  void handler(ctx, parts);
}
