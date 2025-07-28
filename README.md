# Welcome to my project

## Project info
OrderFlow Simulator is a real-time, multi-venue cryptocurrency orderbook viewer and simulator . It empowers users to simulate market and limit orders across exchanges like OKX, Bybit, and Deribit, helping them visualize their order’s position, market impact, and slippage before actual execution.

**Real-Time Orderbook Visualization** - 
Display top 15 bid/ask levels from OKX, Bybit, and Deribit using WebSocket data.

**Smart Order Simulation**-
Simulate buy/sell orders with configurable delay, type (market/limit), price, and quantity.

**Visual Order Placement**-
See exactly where your order would sit in the book with visual highlights and performance metrics (slippage, impact, estimated fill% ).

**Exchange Switching**-
Seamlessly switch between supported venues for side-by-side comparison.

**Responsive & Intuitive UI**-
Optimized for mobile and desktop traders with clear navigation and clean charts .

## How can I edit this code?

**Use your preferred IDE**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Recharts

## API Resources
- OKX API: https://www.okx.com/docs-v5/
- Bybit API: https://bybit-exchange.github.io/docs/v5/intro
- Deribit API: https://docs.deribit.com/

