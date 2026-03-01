/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  RefreshCw, 
  AlertTriangle, 
  Target, 
  BarChart3,
  Info,
  ChevronRight,
  Activity
} from 'lucide-react';
import { TradingMode, TradeSetup, TradeDirection } from './types';
import { generateTradeSetup } from './services/geminiService';
import { getTopTickers } from './services/priceService';

interface TradeCardProps {
  setup: TradeSetup;
}

const TradeCard: React.FC<TradeCardProps> = ({ setup }) => {
  const isLong = setup.direction === TradeDirection.LONG;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className={`h-1.5 w-full ${isLong ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${setup.mode === TradingMode.SPOT ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                {setup.mode}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isLong ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {setup.direction}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {setup.strategyType}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono">{setup.coin}/{setup.pair}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">{setup.exchange}</div>
              <div className="w-1 h-1 bg-zinc-700 rounded-full" />
              <div className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest">{setup.marketRegime}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Confidence</div>
            <div className="text-xl font-bold text-white">{setup.confidenceScore}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Entry Price</div>
            <div className="text-lg font-mono font-semibold text-white">${setup.entry.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Stop Loss</div>
            <div className="text-lg font-mono font-semibold text-rose-400">${setup.stopLoss.toLocaleString()}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Target size={12} /> Take Profit Targets
            </div>
            <div className="flex flex-wrap gap-2">
              {setup.targets.map((target, idx) => (
                <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-emerald-400 font-mono text-sm">
                  T{idx + 1}: ${target.toLocaleString()}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-zinc-800/30 rounded-lg border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase mb-1">Liquidity Score</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${setup.liquidityScore}%` }} />
                </div>
                <span className="text-white font-mono text-xs">{setup.liquidityScore}</span>
              </div>
            </div>
            <div className="p-2 bg-zinc-800/30 rounded-lg border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase mb-1">Sentiment Score</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${setup.sentimentScore}%` }} />
                </div>
                <span className="text-white font-mono text-xs">{setup.sentimentScore}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="text-zinc-500 text-[10px] uppercase">R:R</div>
              <div className="text-white font-semibold text-xs">{setup.riskReward}</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="text-zinc-500 text-[10px] uppercase">Vol. Surge</div>
              <div className="text-white font-semibold text-xs">{setup.volumeSurge}</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="text-zinc-500 text-[10px] uppercase">BTC Align</div>
              <div className="text-white font-semibold text-xs">{setup.btcAlignment}</div>
            </div>
          </div>

          <div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Key Signals Detected</div>
            <div className="flex flex-wrap gap-1">
              {setup.keySignals.map((signal, idx) => (
                <span key={idx} className="text-[9px] font-bold uppercase px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {setup.mode === TradingMode.FUTURES && (
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">Recommended Leverage</span>
                <span className="text-white font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                  {setup.leverage}x
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-xs">Liquidation Price</span>
                <span className="text-rose-400 font-mono text-sm">${setup.liquidationPrice?.toLocaleString()}</span>
              </div>
              {setup.leverage && setup.leverage > 7 && (
                <div className="flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                  <AlertTriangle size={12} />
                  <span>High leverage warning: Extreme volatility risk.</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/30">
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Institutional Reasoning</div>
            <p className="text-zinc-300 text-xs leading-relaxed italic">"{setup.reason}"</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [mode, setMode] = useState<TradingMode>(TradingMode.SPOT);
  const [setups, setSetups] = useState<TradeSetup[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const marketData = await getTopTickers();
      if (marketData.length === 0) {
        throw new Error("Failed to fetch real-time market data.");
      }
      const newSetup = await generateTradeSetup(mode, marketData);
      setSetups(prev => [newSetup, ...prev].slice(0, 10));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate trade setup. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">EliteTrade AI</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Institutional Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex gap-1">
              <button 
                onClick={() => setMode(TradingMode.SPOT)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === TradingMode.SPOT ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Spot
              </button>
              <button 
                onClick={() => setMode(TradingMode.FUTURES)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === TradingMode.FUTURES ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Futures
              </button>
            </div>
            
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              {isScanning ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
              {isScanning ? 'Scanning...' : 'Scan Market'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Institutional <span className="text-emerald-500">Market Intelligence</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Elite-level trade selection based on liquidity, derivatives data, sentiment, and smart money signals.
              {mode === TradingMode.FUTURES 
                ? " Conservative 10x max leverage with institutional risk management." 
                : " Strategic spot accumulation aligned with global market regimes."}
            </p>
          </motion.div>
        </div>

        {/* Risk Warning for Futures */}
        <AnimatePresence>
          {mode === TradingMode.FUTURES && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-1">Futures Risk Advisory</h4>
                  <p className="text-zinc-400 text-sm">
                    Leverage is strictly capped at <span className="text-white font-bold">10x</span>. 
                    Always use stop losses and never risk more than 1-2% of your total portfolio per trade.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Setups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {setups.length > 0 ? (
              setups.map((setup) => (
                <TradeCard key={setup.id} setup={setup} />
              ))
            ) : (
              !isScanning && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="text-zinc-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-400 mb-2">No active setups</h3>
                  <p className="text-zinc-600">Click "Scan Market" to generate AI trade plans.</p>
                </div>
              )
            )}
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white">Analyzing Market Cycles</p>
                    <p className="text-zinc-500 text-sm">Scanning order books and liquidity clusters...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-800 pt-20">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
              <Shield className="text-emerald-500" size={24} />
            </div>
            <h4 className="text-xl font-bold">Risk Management</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Every setup includes precise entry, stop loss, and multiple take-profit targets with a minimum 1:3 risk-reward ratio.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <h4 className="text-xl font-bold">Adaptive Strategies</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              AI adjusts logic based on mode. Spot focuses on trend continuation, while Futures targets volatility and reversals.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
              <Zap className="text-emerald-500" size={24} />
            </div>
            <h4 className="text-xl font-bold">Real-time Analysis</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Our engine simulates 24/7 market scanning to find the most optimal entries across top-tier crypto assets.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-500" size={20} />
            <span className="font-bold text-zinc-400">EliteTrade AI</span>
          </div>
          <p className="text-zinc-600 text-xs text-center md:text-right">
            © 2026 EliteTrade AI. Institutional-grade intelligence for professional traders.
          </p>
        </div>
      </footer>
    </div>
  );
}
