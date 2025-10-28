# Uphold Assessment Price Oscillation Bot

This project is a solution to the Backend Engineer Assessment Challenge. It is a Node.js (TypeScript) application that monitors the Uphold public ticker for specified currency pairs and alerts the user when a price oscillation exceeds a configurable threshold.


## Requirements

*   Node.js (v20 or higher)
*   npm 


## How to Run
### Option 1: Local Execution (Mandatory + Optional Features)

This option runs the bot directly on your machine, fulfilling Phase 1 (v1)

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

4.  **Run the Bot (Phase 1 - Default Configuration):**
    The bot will monitor `BTC-USD` every 5 seconds and alert on a `0.01%` change.
    ```bash
    npm start
    ```

5.  **Run the Bot (Phase 2 - Custom Configuration):**
    You can use command-line arguments to customize the monitoring.
    *   `--pairs`: Comma-separated list of currency pairs (e.g., `BTC-USD,ETH-EUR`).
    *   `--threshold`: Price oscillation percentage (e.g., `0.01` for 0.01%).
    *   `--interval`: Fetch interval in milliseconds (e.g., `5000` for 5 seconds).

    Example: Monitor `BTC-USD` and `ETH-EUR` every 3 seconds for a `0.1%` change.
    ```bash
    npm start --pairs=BTC-USD,ETH-EUR --threshold=0.1 --interval=3000
    ```


## Project Structure

```
.
├── src/
│   ├── config                              # Configuration-related files
│   │    └── BotConfig.ts                   # Bot-specific configurations and constants
│   ├── core                                # Core logic of the bot
│   │    ├── AlertService.ts                # Logic for managing and triggering alerts
│   │    ├── PriceService.ts                # Logic for fetching price data from external APIs
│   │    └── UpholdBot.ts                   # Bot core execution
│   ├── services                            # External communication (e.g., database, API)
│   │    └── UpholdAPI.ts                   # API interaction with the Uphold service
├── utils/                                  # Utility functions
│   └── Logger.ts                           # For logging purposes 
├── index.ts                                # Main entry point to run the bot
├── package.json
├── tsconfig.json
└── README.md                               # This file
```

