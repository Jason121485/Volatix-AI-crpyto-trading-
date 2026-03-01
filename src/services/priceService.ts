export interface PriceData {
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
}

export async function getTopTickers(): Promise<PriceData[]> {
  try {
    const response = await fetch('/api/prices');
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Filter for USDT pairs and sort by volume or price change
    return data
      .filter((t: any) => t.symbol.endsWith('USDT'))
      .map((t: any) => ({
        symbol: t.symbol,
        price: parseFloat(t.lastPrice),
        priceChangePercent: parseFloat(t.priceChangePercent),
        volume: parseFloat(t.quoteVolume),
      }))
      .sort((a: any, b: any) => b.volume - a.volume)
      .slice(0, 50); // Top 50 by volume
  } catch (error) {
    console.error('Error fetching prices:', error);
    return [];
  }
}

export async function getPriceForSymbol(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/prices`);
    const data = await response.json();
    const ticker = data.find((t: any) => t.symbol === symbol);
    return ticker ? parseFloat(ticker.lastPrice) : null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}
