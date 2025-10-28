import { UpholdAPI, UpholdTicker } from '../services/UpholdAPI.js';

export interface PriceChangeResult {
  pair: string;
  previous: number;
  current: number;
  change: number;
}

/**
 * Handles price retrieval using an external API, normalization, and change detection
 * 
 * Keeps the latest price for each pair in memory and reports when a price change exceeds a given threshold
 */
export class PriceService {
  private lastPrices: Map<string, number> = new Map();
  private upholdAPI: UpholdAPI;

  constructor() {
    this.upholdAPI = new UpholdAPI();
  }

  public normalizePriceNumbers(rawPrice: number): number {
    return parseFloat(rawPrice.toFixed(4));
  }

  /**
   * Fetches the current market price for a pair from UpholdAPI,
   */
  public async getPriceUpholdAPI(pair: string): Promise<number> {
    const ticker: UpholdTicker = await this.upholdAPI.getTicker(pair);
    const normalizedPrice: number = parseFloat(ticker.ask);
    return this.normalizePriceNumbers(normalizedPrice);
  }

  /**
   * Calculates the absolute percentage change between two prices
   */
  public getPriceChangePercentage(previous: number, current: number): number {
    return this.normalizePriceNumbers(Math.abs((current - previous) / previous) * 100);
  }

  /**
   * Fetches the latest price and compares it with the previous one
   * @returns   - a `PriceChangeResult` if the change exceeds the threshold
   *            - null on the first check or if change is below threshold.
   */
  public async checkPriceChange(pair: string, threshold: number): Promise<PriceChangeResult | null> {
    const current = await this.getPriceUpholdAPI(pair);
    const previous = this.lastPrices.get(pair);
    // updates price for next ticker
    this.lastPrices.set(pair, current);

    // no previous -> skip first iteration
    if (!previous) return null;

    const change = this.getPriceChangePercentage(previous, current);

    // Returns PriceChangeResult if threshold is exceeded
    if (change >= threshold) {
      return { pair, previous, current, change };
    }
    return null;
  }


}
