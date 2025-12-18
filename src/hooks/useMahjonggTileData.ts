// See hooks-explained.md for more detailed explanation

import { useMemo } from "react";
import type { TileSymbol, TileSymbols } from "../types/tile-meta";
import { loadTileSymbols } from "../utils/tileSymbolLoader";

export function useMahjonggTileData(): TileSymbol[] {
  
  const tileCache: TileSymbol[] = useMemo(() => {
    
    const symbols: TileSymbols = loadTileSymbols();

    return symbols.asArray;

  }, []);

  return tileCache;
}
