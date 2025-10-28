import { UpholdAPI, UpholdTicker } from '../services/UpholdAPI.js';

/**
 * Fetches live price data from Uphold API
 */
export class PriceService {
  private upholdAPI: UpholdAPI;

  constructor() {
    this.upholdAPI = new UpholdAPI();
  }

  /**
   * Gets current market price for a given trading pair,
   */
  public async getPrice(pair: string): Promise<number> {
    const ticker: UpholdTicker = await this.upholdAPI.getTicker(pair);
    return parseFloat(ticker.ask);
  }
}
