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
   * Triggers an alert and returns the alert full configuration
   */
  public triggerAlert(pair: string, change: number, previous: number, currentPrice: number, botConfigId: number): AlertConfiguration {
    const timeNow: Date = new Date();

    Logger.info(`📢 [ALERT] ${pair} price changed by ${change.toFixed(4)}%. 
    Previous: $${previous.toFixed(3)} | Current: $${currentPrice.toFixed(3)} | Time: ${timeNow.toLocaleTimeString()}`);

    return {
      pair: pair,
      previousPrive: previous,
      currentPrice: currentPrice,
      changePercentage: change,
      alertTime: timeNow,
      botConfigId: botConfigId
    }
  }

  /**
   * Checks if the change is bigger than the threshold to alert
   */
  public checkOscillationForAlert(change: number, threshold: number): boolean {
    return change >= threshold;
  }

}
