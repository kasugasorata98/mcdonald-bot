import { BotController } from "./modules/bot";
import * as readline from "readline";
import { executeCommand } from "./cli/commands";
import { createLogger } from "./helpers/logger";

const outputPath = "result.txt";
const logger = createLogger(outputPath);
const controller = new BotController(logger);

logger.info("CLI started. Type 'help' for commands.");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function prompt(): void {
  rl.question("> ", (answer) => {
    executeCommand({ controller, log: (m) => logger.info(m) }, answer);
    prompt();
  });
}

prompt();
