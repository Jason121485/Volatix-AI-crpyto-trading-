import { GoogleGenAI, Type } from "@google/genai";
import { TradingMode, TradeSetup, TradeDirection } from "../types";
import { PriceData } from "./priceService";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const tradeSetupSchema = {
  type: Type.OBJECT,
  properties: {
    coin: { type: Type.STRING },
    pair: { type: Type.STRING },
    direction: { type: Type.STRING, enum: ["LONG", "SHORT"] },
    strategyType: { type: Type.STRING, enum: ["Breakout", "Pullback", "Reversal", "Liquidity Sweep", "Mean Reversion"] },
    strategy: { type: Type.STRING },
    reason: { type: Type.STRING },
    exchange: { type: Type.STRING },
    entry: { type: Type.NUMBER },
    stopLoss: { type: Type.NUMBER },
    targets: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
    },
    riskReward: { type: Type.STRING },
    leverage: { type: Type.NUMBER },
    liquidationPrice: { type: Type.NUMBER },
    marginRequired: { type: Type.STRING },
    positionSize: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
    volatilityLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    volumeSurge: { type: Type.STRING },
    btcAlignment: { type: Type.STRING },
    marketRegime: { type: Type.STRING, enum: ["Trending", "Ranging", "High Volatility", "Low Liquidity", "News Driven"] },
    keySignals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    liquidityScore: { type: Type.NUMBER },
    sentimentScore: { type: Type.NUMBER },
  },
  required: [
    "coin",
    "pair",
    "direction",
    "strategyType",
    "strategy",
    "reason",
    "exchange",
    "entry",
    "stopLoss",
    "targets",
    "riskReward",
    "positionSize",
    "confidenceScore",
    "volatilityLevel",
    "volumeSurge",
    "btcAlignment",
    "marketRegime",
    "keySignals",
    "liquidityScore",
    "sentimentScore",
  ],
};

export async function generateTradeSetup(mode: TradingMode, marketContext: PriceData[]): Promise<TradeSetup> {
  const marketSummary = marketContext.map(t => `${t.symbol}: $${t.price} (${t.priceChangePercent}%)`).join(', ');
  
  const prompt = `
    Act as an institutional-level crypto trading analyst. Generate a high-probability trade setup for ${mode} trading.
    
    REAL-TIME MARKET CONTEXT (Binance):
    ${marketSummary}
    
    CURRENT TIME: ${new Date().toISOString()}
    
    ELITE TRADING PARAMETERS TO EVALUATE:
    1. Momentum & Volatility: Volume surge, volatility expansion, breakouts.
    2. Liquidity & Market Quality: Order book depth, slippage risk, liquidity zones.
    3. Derivatives Data: Open interest changes, funding rate extremes, long/short ratio.
    4. Smart Money & Whale Signals: Large transactions, exchange inflows/outflows.
    5. News & Sentiment Analysis: Regulatory news, listings, social media spikes.
    6. Market Context: Bitcoin Dominance, BTC volatility spikes, alt season conditions.
    7. Market Regime Detection: Trending, Ranging, High Volatility, Low Liquidity, News-driven.
    
    ${mode === TradingMode.FUTURES ? `
    FUTURES RULES:
    - Maximum leverage: 10x.
    - Suggest conservative leverage (3x-5x).
    - Calculate liquidation price based on entry and leverage.
    - Risk-Reward must be at least 1:3, preferably 1:4 to 1:6.
    - Include both LONG and SHORT setups.
    ` : `
    SPOT RULES:
    - No leverage.
    - Focus on trend-following and swing continuation.
    - Risk-Reward must be at least 1:3.
    - Only LONG setups.
    `}
    
    MANDATORY: Use the REAL-TIME prices provided in the context for entry, stop loss, and targets.
    Provide a detailed "reason" field summarizing the confluence of signals.
    Select a specific strategy type: Breakout, Pullback, Reversal, Liquidity Sweep, or Mean Reversion.
    List the "keySignals" that triggered this selection (e.g., "OI Spike", "Whale Accumulation", "Liquidity Sweep").
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: tradeSetupSchema,
    },
  });

  const data = JSON.parse(response.text || "{}");
  
  return {
    ...data,
    id: Math.random().toString(36).substring(7),
    mode,
    timestamp: Date.now(),
    direction: data.direction as TradeDirection,
  };
}
