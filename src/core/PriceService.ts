import { UpholdAPI, UpholdTicker } from '../services/UpholdAPI.js';

/**
 * Fetches live price data from Uphold API
 */
export class PriceService {
  private lastPrices: Map<string, number> = new Map();
  private upholdAPI: UpholdAPI;

  constructor() {
    this.upholdAPI = new UpholdAPI();
  }

  public normalizePriceNumbers(rawPrice: number) : number {
    return parseFloat(rawPrice.toFixed(4));
  }

  /**
   * Gets current market price for a given trading pair,
   */
  public async getPriceExternalAPI(pair: string): Promise<number> {
    const ticker: UpholdTicker = await this.upholdAPI.getTicker(pair);
    const normalizedPrice : number = parseFloat(ticker.ask);
    return this.normalizePriceNumbers(normalizedPrice);
  }

  public getPriceChangePercentage(previous: number, current: number): number {
    return this.normalizePriceNumbers(Math.abs((current - previous) / previous) * 100);
  }

  public getLastPrice(pair: string) {
    return this.lastPrices.get(pair);
  }

  public setLastPrice(pair: string, price: number) {
    return this.lastPrices.set(pair, price);
  }

}
