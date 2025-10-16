import { BotController } from "./bot";
import * as readline from "readline";
import { executeCommand } from "./cli/commands";
import { createLogger } from "./helpers/logger";
import { Config } from "./config";

const logger = createLogger(Config.outputPath);
const controller = new BotController(logger);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function prompt(): void {
  logger.info("CLI started. Type 'help' for commands.");
  rl.question("> ", (answer) => {
    executeCommand({ controller, log: (m) => logger.info(m) }, answer);
    prompt();
  });
}

prompt();
