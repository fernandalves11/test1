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
  private priceFetcherServ: PriceService;
  private alertServ: AlertService;
  private lastPrices: Map<string, number> = new Map();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.botConfig = new BotConfig();
    this.priceFetcherServ = new PriceService();
    this.alertServ = new AlertService();
  }

  /**
   * Checks whether the current price differs from the previous price by more than the configured threshold. 
   * If yes, triggers an alert.
   */
  private checkOscillation(pair: string, currentPrice: number): void {
    // store last price from the current pair for the next ticker update
    const previous = this.lastPrices.get(pair);
    this.lastPrices.set(pair, currentPrice);

    //skips comparison if is the first recorded price
    if (!previous) return;

    const change = Math.abs((currentPrice - previous) / previous) * 100;

    //if price changed more than threshold, fire alert
    if (change >= this.botConfig.getThreshold()) {
      this.alertServ.triggerAlert(pair, change, previous, currentPrice);
    }
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
        //gets price from API through price service
        const price = await this.priceFetcherServ.getPrice(pair);
        
        //check for oscilation in the retrieved price
        if (price !== null) this.checkOscillation(pair, price);
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