import { CommandHandler } from "./types";
import { CMD_NORMAL, CMD_ORDER, CMD_VIP } from "../../constants/commands";

export const handleOrder: CommandHandler = (ctx, parts) => {
  const [cmd, second] = parts;
  if (cmd === CMD_NORMAL && second === CMD_ORDER) {
    ctx.controller.createNormalOrder();
    return;
  }
  if (cmd === CMD_VIP && second === CMD_ORDER) {
    ctx.controller.createVipOrder();
    return;
  }
  ctx.log("Usage: normal order | vip order");
};
