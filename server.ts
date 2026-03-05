import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);

  // WebSocket Server setup
  const wss = new WebSocketServer({ server: httpServer });

  // Connect to Binance WebSocket for real-time ticker updates
  const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

  binanceWs.on('message', (data) => {
    const tickers = JSON.parse(data.toString());
    const usdtTickers = tickers
      .filter((t: any) => t.s.endsWith('USDT'))
      .map((t: any) => ({
        s: t.s, // symbol
        p: t.c, // last price
        P: t.P, // price change percent
        v: t.q, // volume (quote)
      }));

    // Broadcast to all connected clients
    const message = JSON.stringify({ type: 'TICKER_UPDATE', data: usdtTickers });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  binanceWs.on('error', (error) => {
    console.error('Binance WS Error:', error);
  });

  // Proxy route for initial load
  app.get("/api/prices", async (req, res) => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching from Binance:', error);
      res.status(500).json({ error: 'Failed to fetch prices from Binance' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
