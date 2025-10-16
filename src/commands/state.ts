import { CommandHandler } from "./types";

export const handleState: CommandHandler = (ctx) => {
  ctx.printState("State");
};

export const handleHelp: CommandHandler = (ctx) => {
  ctx.log(
    "Commands: help | order normal | order vip | +bot | -bot | state | quit"
  );
};
