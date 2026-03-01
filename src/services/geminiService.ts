import { GoogleGenAI, Type } from "@google/genai";
import { TradingMode, TradeSetup, TradeDirection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const tradeSetupSchema = {
  type: Type.OBJECT,
  properties: {
    coin: { type: Type.STRING },
    pair: { type: Type.STRING },
    direction: { type: Type.STRING, enum: ["LONG", "SHORT"] },
    strategyType: { type: Type.STRING, enum: ["Breakout", "Pullback", "Reversal"] },
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
  ],
};

export async function generateTradeSetup(mode: TradingMode): Promise<TradeSetup> {
  const prompt = `
    Act as a professional crypto volatility analyst. Generate a high-probability trade setup for ${mode} trading by scanning major exchanges (Binance, Bybit, OKX, Coinbase, Kraken).
    
    VOLATILITY SCANNER CRITERIA:
    - Focus on high-liquidity altcoins and top volume gainers.
    - Identify volume surges (3x-10x average).
    - Look for ATR spikes and breakouts from consolidation.
    - Consider open interest shifts and liquidation clusters.
    
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
    
    The setup should be realistic based on current market trends (simulated for this request).
    Provide a detailed "reason" field summarizing Volatility + Momentum + Volume.
    Select a specific strategy type: Breakout, Pullback, or Reversal.
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
