import { Logger } from "../utils/Logger.js";

export interface AlertConfiguration {
  pair: string,
  previousPrive: number,
  currentPrice: number,
  changePercentage: number,
  alertTime: Date,
  botConfigId: number
}

/**
 * Handles alerting when price moves
 */
export class AlertService {
  constructor() { }

  /**
   * Triggers the alert to the Logger
   * @return AlertConfiguration interface with alert full data
   */
  triggerAlert(pair: string, change: number, previous: number, currentPrice: number, botConfigId: number): AlertConfiguration {
    const currentTime: Date = new Date();

    Logger.info(`📢 [ALERT] ${pair} price changed by ${change.toFixed(4)}%. 
    Previous: $${previous.toFixed(3)} | Current: $${currentPrice.toFixed(3)} | Time: ${currentTime.toLocaleTimeString()}`);

    return {
      pair: pair,
      previousPrive: previous,
      currentPrice: currentPrice,
      changePercentage: change,
      alertTime: currentTime,
      botConfigId: botConfigId
    }
  }
}
