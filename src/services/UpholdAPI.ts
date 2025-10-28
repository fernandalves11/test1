import fetch from 'node-fetch';
import { Logger } from '../utils/Logger.js';

export interface UpholdTicker {
  ask: string;
  bid: string;
  currency: string;
}

/**
 *  Handles communication with Uphold API
 */
export class UpholdAPI {
  private readonly baseUrl = 'https://api.uphold.com/v0/ticker/';

  /**
   *Fetches ticker data for a specific trading pair from the Uphold public API.
   */
  public async getTicker(pair: string): Promise<UpholdTicker> {
    const response = await fetch(`${this.baseUrl}${pair}`);
    const data: unknown = await response.json();

    //check for result errors
    if (typeof data === 'object' && data !== null && 'code' in data) {
      Logger.error(`Uphold API error on pair "${pair}" : ${JSON.stringify(data)}`);
    }

    //otherwise, success, return parsed ticker data
    return data as UpholdTicker;
  }
}
