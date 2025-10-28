export interface BotConfigOptions {
  pairs: string[],
  interval: number,
  threshold: number,
}

/**
 * Bot-specific configurations and constants
 */
export class BotConfig implements BotConfigOptions {
  pairs: string[];
  interval: number;
  threshold: number;

  // Default configuration
  private static defaults: BotConfigOptions = {
    pairs: ["BTC-USD"],
    interval: 5000,       // 5 seconds
    threshold: 0.01       // 0.01%
  };

  constructor() {
    // assign default values (fixed: threshold was incorrectly set to interval)
    const config: BotConfigOptions = this.parseArguments();
    this.pairs = config.pairs;
    this.threshold = config.threshold;
    this.interval = config.interval;
  }

  private parseArguments(): BotConfigOptions {
    const pairsArg = process.env.npm_config_pairs;
    const intervalArg = process.env.npm_config_interval;
    const thresholdArg = process.env.npm_config_threshold;

    const pairs = pairsArg ? pairsArg.split(',') : BotConfig.defaults.pairs;
    const interval = intervalArg ? parseInt(intervalArg, 10) : BotConfig.defaults.interval;
    const threshold = thresholdArg ? parseFloat(thresholdArg) : BotConfig.defaults.threshold;

    return { pairs: pairs, interval: interval, threshold: threshold };
  }

  public getPairs(): string[] {
    return this.pairs;
  }

  public getInterval(): number {
    return this.interval;
  }

  public getThreshold(): number {
    return this.threshold;
  }

  public toJSON(): BotConfigOptions {
    return {
      pairs: this.pairs,
      interval: this.interval,
      threshold: this.threshold
    };
  }
}
