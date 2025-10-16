import { CommandHandler } from "./types";

export const handleAddBot: CommandHandler = (ctx, parts) => {
  ctx.controller.addBot();
};

export const handleRemoveBot: CommandHandler = (ctx, parts) => {
  ctx.controller.removeBot();
};
