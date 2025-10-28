import { Pool } from 'pg';
import { AlertConfiguration } from '../core/AlertService.js';
import { BotConfigOptions } from '../config/BotConfig.js';

const connectionString = process.env.DATABASE_URL || process.env.PG_URI || 'postgres://myuser:mypassword@localhost:5432/mydb';
// LOCAL 'postgres://myuser:mypassword@localhost:5432/mydb'
// DOCKER 'postgresql://user:password@localhost:5432/uphold'
const pool = new Pool({
  connectionString,
});

export async function initDb() {
  const client = await pool.connect();
  try {
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
  } finally {
    client.release();
  }
}

export async function saveAlert(alertConfig: AlertConfiguration): Promise<void> {
  const res = await pool.query(
    'INSERT INTO alerts(pair, previous_price, current_price, change_percentage, alert_time, bot_config_id) VALUES($1, $2, $3, $4, $5, $6)',
    [alertConfig.pair, alertConfig.previousPrive, alertConfig.currentPrice, alertConfig.changePercentage, alertConfig.alertTime, alertConfig.botConfigId]
  );
}

export async function saveBotConfig(botOptions: BotConfigOptions): Promise<number> {
  const res = await pool.query(
    'INSERT INTO bot_config (pairs, interval, threshold) VALUES($1, $2, $3) RETURNING id',
    [botOptions.pairs, botOptions.interval, botOptions.threshold]);
  return res.rows[0].id;
}

export async function closeDb() {
  await pool.end();
}



export default { initDb, saveAlert, saveBotConfig, closeDb };
