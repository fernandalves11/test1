import { Logger } from "../utils/Logger.js";

/**
 * Handles alerting when price moves
 */
export class AlertService {
  constructor() { }

  /**
   * Triggers an alert on pair changes price.
   */
  async triggerAlert(pair: string, change: number, previous: number, currentPrice: number) {
    Logger.info(`📢 [ALERT] ${pair} price changed by ${change.toFixed(4)}%. 
    Previous: $${previous.toFixed(3)} | Current: $${currentPrice.toFixed(3)} | Time: ${new Date().toLocaleTimeString()}`);
  }
}

