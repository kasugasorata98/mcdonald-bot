import { CommandHandler } from "./types";

export const handleOrder: CommandHandler = (ctx, parts) => {
  const kind = parts[1];
  if (kind === "normal" || kind === "regular") {
    ctx.controller.createNormalOrder();
    return;
  }
  if (kind === "vip" || kind === "priority") {
    ctx.controller.createVipOrder();
    return;
  }
  ctx.log("Usage: order normal | order vip");
};
