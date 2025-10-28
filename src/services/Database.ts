import { Pool, PoolClient, QueryResult } from 'pg';
import { AlertConfiguration } from '../core/AlertService.js';
import { BotConfigOptions } from '../config/BotConfig.js';
import { Logger } from '../utils/Logger.js';

const connectionString = process.env.DATABASE_URL || process.env.PG_URI || 'postgresql://user:password@localhost:5432/uphold';
const pool = new Pool({ connectionString });

export async function initDb(): Promise<void> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS bot_config (
          id SERIAL PRIMARY KEY,
          pairs TEXT[] NOT NULL,
          interval NUMERIC NOT NULL,
          threshold NUMERIC NOT NULL
      );

      CREATE TABLE IF NOT EXISTS alerts (
          id SERIAL PRIMARY KEY,
          pair TEXT NOT NULL,
          previous_price NUMERIC NOT NULL,
          current_price NUMERIC NOT NULL,
          change_percentage NUMERIC NOT NULL,
          alert_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
          bot_config_id INT NOT NULL REFERENCES bot_config(id) ON DELETE CASCADE
      );
    `);
  } catch (err) {
    Logger.error("Database initialization failed!! ", " ERROR: ", err);
    throw err;
  } finally {
    if (client) client.release();
  }
}

export async function saveAlert(alertConfig: AlertConfiguration): Promise<void> {
  try {
    await pool.query(
      'INSERT INTO alerts(pair, previous_price, current_price, change_percentage, alert_time, bot_config_id) VALUES($1, $2, $3, $4, $5, $6)',
      [alertConfig.pair, alertConfig.previousPrive, alertConfig.currentPrice, alertConfig.changePercentage, alertConfig.alertTime, alertConfig.botConfigId]
    );
  } catch (err) {
    Logger.error("Failed to save alert: ", JSON.stringify(alertConfig, null, 2), " ERROR: ", err);
  }
}

export async function saveBotConfig(botOptions: BotConfigOptions): Promise<number> {
  try {
    const res: QueryResult = await pool.query(
      'INSERT INTO bot_config (pairs, interval, threshold) VALUES($1, $2, $3) RETURNING id',
      [botOptions.pairs, botOptions.interval, botOptions.threshold]);
    return res.rows[0].id;
  } catch (err) {
    Logger.error("Failed to save bot configuration: ", JSON.stringify(botOptions, null, 2), " ERROR: ", err);
    throw err;
  }
}

export async function closeDb() {
  try {
    await pool.end();
  } catch (err) {
    Logger.error("Error closing database connection:", " ERROR: ", err);
  }
}

export default { initDb, saveAlert, saveBotConfig, closeDb };
