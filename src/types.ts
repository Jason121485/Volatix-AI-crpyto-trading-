export enum TradingMode {
  SPOT = 'SPOT',
  FUTURES = 'FUTURES',
}

export enum TradeDirection {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export type StrategyType = 'Breakout' | 'Pullback' | 'Reversal' | 'Liquidity Sweep' | 'Mean Reversion';

export type MarketRegime = 'Trending' | 'Ranging' | 'High Volatility' | 'Low Liquidity' | 'News Driven';

export interface TradeSetup {
  id: string;
  mode: TradingMode;
  coin: string;
  pair: string;
  direction: TradeDirection;
  strategyType: StrategyType;
  strategy: string;
  reason: string;
  exchange: string;
  entry: number;
  stopLoss: number;
  targets: number[];
  riskReward: string;
  leverage?: number;
  liquidationPrice?: number;
  marginRequired?: string;
  positionSize: string;
  confidenceScore: number;
  volatilityLevel: 'Low' | 'Medium' | 'High';
  volumeSurge: string;
  btcAlignment: string;
  marketRegime: MarketRegime;
  keySignals: string[];
  liquidityScore: number; // 1-100
  sentimentScore: number; // 1-100
  timestamp: number;
}

export interface MarketState {
  mode: TradingMode;
  setups: TradeSetup[];
  isScanning: boolean;
}
