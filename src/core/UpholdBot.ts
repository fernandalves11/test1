import readline from "readline";
import { AlertService } from './AlertService.js';
import { BotConfig } from '../config/BotConfig.js';
import { PriceService } from './PriceService.js';
import { Logger } from '../utils/Logger.js';

/**
 * Main controller that ties everything together: config, pricing and alerts.
 */
export class UpholdBot {
  private botConfig: BotConfig;
  private priceServ: PriceService;
  private alertServ: AlertService;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.botConfig = new BotConfig();
    this.priceServ = new PriceService();
    this.alertServ = new AlertService();
  }

  /**
   * Starts the bot - Logs configuration, begins periodic price checks, and listens for console commands.
   **/
  public start(): void {
    Logger.info("▶️  Starting Uphold price alert bot. Time: ", new Date().toLocaleTimeString());
    Logger.info("🛠️  Bot Config Options: ", JSON.stringify(this.botConfig.toJSON(), null, 2));

    //schedule price checks using the configured interval
    this.intervalId = setInterval(async () => {
      for (const pair of this.botConfig.getPairs()) {
        const result = await this.priceServ.checkPriceChange(pair, this.botConfig.getThreshold());
        if (result) {
          this.alertServ.triggerAlert(result.pair, result.change, result.previous, result.current);
        }
      }
    }, this.botConfig.getInterval());

    //enable user interaction via console commands
    this.listenForCommands();
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      Logger.info("🔴 Bot stopped.");
    }
  }

  /**
   * Listens for command-line input to interact with the bot
   */
  private listenForCommands(): void {
    const rl = readline.createInterface({ input: process.stdin });

    rl.on("line", (input) => {
      const command = input.trim();

      // bot stop command
      if (command === "stop") {
        this.stop();
        rl.close();
      } else {
        Logger.warn(`Unknown command: ${command}`);
      }
    });

    Logger.info("🟥 Type 'stop' and press Enter to stop the bot.");
  }
}