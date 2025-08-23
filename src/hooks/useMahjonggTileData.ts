// See hooks-explained.md for more detailed explanation

import { useMemo } from "react";
import type { TileSymbol, TileSymbols } from "../types/TileProps";
import { loadTileSymbols } from "../utils/tileSymbolLoader";

export function useMahjonggTileData(): TileSymbol[] {
  
  const tileCache: TileSymbol[] = useMemo(() => {
    
    const symbols: TileSymbols = loadTileSymbols();

    return symbols.asArray;

  }, []);

  console.log('useMahjonggTileData returning:', {
    count: tileCache.length,
    tiles: tileCache.map(t => t.name)
  });

  console.table(tileCache)

  return tileCache;
}
