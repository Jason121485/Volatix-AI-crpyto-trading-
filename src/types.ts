export enum TradingMode {
  SPOT = 'SPOT',
  FUTURES = 'FUTURES',
}

export enum TradeDirection {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export type StrategyType = 'Breakout' | 'Pullback' | 'Reversal';

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
  timestamp: number;
}

export interface MarketState {
  mode: TradingMode;
  setups: TradeSetup[];
  isScanning: boolean;
}
