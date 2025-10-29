# Uphold Assessment Price Oscillation Bot

This project is a solution to the Backend Engineer Assessment Challenge. It is a Node.js (TypeScript) application that monitors the Uphold public ticker for specified currency pairs and alerts the user when a price oscillation exceeds a configurable threshold.


## Requirements

*   Node.js (if running locally)
*   npm 
*   Docker


## Features

- Monitor multiple trading pairs (e.g., BTC-USD, ETH-USD)
- Configurable alert interval and threshold
- Alerts stored in PostgreSQL
- Fully Dockerized  
- Dynamic configuration via environment variables
- Shutdown via console commands

---

## How to Run
### Option 1: Local Execution 

#### Configuration

The bot is configurable via environment variables. You can provide them through a `.env` file or inline in Docker Compose.
--user=myuser --password=mypassword --host=localhost --port=5432 --dbname=mydb
| Variable    | Description                                    | Default            |
|-------------|------------------------------------------------|--------------------|
| `user`      | PostgreSQL username                            | `user`             |
| `password`  | PostgreSQL password                            | `password`         |
| `host`      | PostgreSQL host (use service name in Docker)   | `db`               |
| `port`      | PostgreSQL port                                | `5432`             |
| `dbname`    | PostgreSQL database name                       | `upholddb`         |
| `pairs`     | Comma-separated trading pairs                  | `BTC-USD`          |
| `interval`  | Polling interval in seconds                    | `5000`             |
| `threshold` | Alert threshold percentage                     | `0.01`             |


#### Running

1.  **Navigate to the project directory:**
    ```bash
    cd uphold-assessment-bot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build dist/js files**
    ```bash
    npm run build
    ```

4.  **Run the Bot (Default Configuration):**
    The bot will monitor `BTC-USD` every 5 seconds and alert on a `0.01%` change.
    ```bash
    npm start
    ```

5.  **Run the Bot (Custom Configuration):**
    You can use command-line arguments to customize the monitoring.
    *   `--pairs`: Comma-separated list of currency pairs (e.g., `BTC-USD,ETH-EUR`).
    *   `--threshold`: Price oscillation percentage (e.g., `0.01` for 0.01%).
    *   `--interval`: Fetch interval in milliseconds (e.g., `5000` for 5 seconds).

    Example: Monitor `BTC-USD` and `ETH-EUR` every 3 seconds for a `0.1%` change.
    ```bash
    npm start --pairs=BTC-USD,ETH-EUR --threshold=0.1 --interval=3000
    ```

6.  **Run the Bot (Database Custom Configuration):**
    You can use command-line arguments to customize the monitoring.
    *   `--pairs`: Comma-separated list of currency pairs (e.g., `BTC-USD,ETH-EUR`).
    *   `--threshold`: Price oscillation percentage (e.g., `0.01` for 0.01%).
    *   `--interval`: Fetch interval in milliseconds (e.g., `5000` for 5 seconds).

    Example: Monitor `BTC-USD` and `ETH-EUR` every 3 seconds for a `0.1%` change.
    ```bash
    npm start --user=myuser --password=mypassword --host=localhost --port=5432 --dbname=mydb
    ```


### Option 2: Dockerized Execution

#### Configuration

The bot is configurable via environment variables. You can provide them through a `.env` file or inline in Docker Compose.

| Variable        | Description                                    | Default            |
|-----------------|------------------------------------------------|--------------------|
| `DB_USER`       | PostgreSQL username                            | `user`             |
| `DB_PASSWORD`   | PostgreSQL password                            | `password`         |
| `DB_HOST`       | PostgreSQL host (use service name in Docker)   | `db`               |
| `DB_PORT`       | PostgreSQL port                                | `5432`             |
| `DB_NAME`       | PostgreSQL database name                       | `upholddb`         |
| `BOT_PAIRS`     | Comma-separated trading pairs                  | `BTC-USD`          |
| `BOT_INTERVAL`  | Polling interval in seconds                    | `5000`             |
| `BOT_THRESHOLD` | Alert threshold percentage                     | `0.01`             |



#### Running

1.  **Navigate to the project directory:**
    ```bash
    cd uphold-bot-assessment
    ```

2. **Setup the custom variables (Optional)**

    **2.1. Through `.env` file**

        ```env
        # PostgreSQL configuration
        DB_USER=user
        DB_PASSWORD=password
        DB_HOST=db
        DB_PORT=5432
        DB_NAME=upholddb

        BOT_PAIRS=BTC-USD
        BOT_INTERVAL=5000
        BOT_THRESHOLD=0.01
        ```

    **2.1. Through environment variables (PowerShell example)**
        ```powershell
        $env:BOT_PAIRS="BTC-USD,ETH-USD"
        $env:BOT_INTERVAL="5000"
        $env:BOT_THRESHOLD="0.01"
        docker compose up --build
        ```

3.  **Build and run the containers:**
    This command will build the `uphold-bot-assessment` image, start the `db` container, and then start the bot container, which will automatically connect to the database.
    ```bash
    docker-compose up --build
    ```
    - The bot container connects automatically to the database container
    - The bot reads trading pairs, interval, and threshold from the environment variables

4.  **Stopping the containers:**
    Press `Ctrl+C` in the terminal where `docker-compose up` is running, then run:
    ```bash
    docker-compose down
    ```

## Project Structure

```

├── .dockerignore
├── .env                        # environment variables for Docker
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── README.md                   # This file
├── src/
│   ├── index.ts                # app entry point
│   ├── config/
│   │   └── BotConfig.ts        # bot configuration class
│   ├── core/
│   │   ├── UpholdBot.ts        # main bot class
│   │   ├── AlertService.ts     # alert handling
│   │   └── PriceService.ts     # price fetching and calculations
│   ├── services/
│   │   ├── Database.ts         # PostgreSQL connection and queries
│   │   └── UpholdAPI.ts        # Uphold API communication
│   └── utils/
│       └── Logger.ts           # logging utility
├── dist/                       # compiled JavaScript output
└── node_modules/
```

---

## Database Schema

```sql
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
```

---

## Commands

- `stop` – Stop the bot gracefully from inside the container shell.  
- Alerts are printed to stdout and stored in PostgreSQL automatically.  

---