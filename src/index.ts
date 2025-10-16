import { BotController } from "./modules/bot/bot.controller";
import { formatTime } from "./utils/time";
import * as fs from "fs";
import * as readline from "readline";
import { executeCommand } from "./commands";

// Interactive CLI matching requirements:
// - Dynamically add/remove bots and create orders
// - Write status and completions with HH:MM:SS timestamps to result.txt

const controller = new BotController((msg) => log(msg));
const outputPath = "result.txt";

function log(line: string): void {
  const ts = formatTime(new Date());
  const formatted = `[${ts}] ${line}`;
  // Write to file
  fs.appendFileSync(outputPath, `${formatted}\n`);
  // Also print to console for interactive feedback
  // eslint-disable-next-line no-console
  console.log(formatted);
}

function printState(prefix: string): void {
  const s = controller.getState();
  log(
    `${prefix} | PENDING vip=${s.pendingVipCount} normal=${s.pendingNormalCount} | BOTS active=${s.activeBotIds.length} busy=${s.busyBotIds.length} | COMPLETE=${s.completedCount}`
  );
}

// Reset output file
try {
  fs.unlinkSync(outputPath);
} catch {}

log("CLI started. Type 'help' for commands.");

// Completions are logged by Controller via the injected logger (event-driven)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function prompt(): void {
  rl.question("> ", (answer) => {
    executeCommand({ controller, log, printState }, answer);
    prompt();
  });
}

// Show help via command system
executeCommand({ controller, log, printState }, "help");

prompt();
