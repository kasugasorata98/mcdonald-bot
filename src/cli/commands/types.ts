import { BotController } from "../../modules/bot/bot.controller";

export type CommandContext = {
  controller: BotController;
  log: (message: string) => void;
};

export type CommandHandler = (
  ctx: CommandContext,
  parts: string[]
) => void | Promise<void>;
