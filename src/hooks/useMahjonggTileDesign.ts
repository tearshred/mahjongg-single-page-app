import { useMemo } from "react";
import { loadTileSymbols } from "../utils/tileSymbolLoader";
import type { SVGComponent } from "../types/tile-meta";

const preloadedSymbols = loadTileSymbols();

export function useMahjonggTileDesign() {
  const tileSymbolLookup = useMemo(() => {
    const symbolLookupMap = new Map<string, SVGComponent>();
    preloadedSymbols.asArray.forEach((tileSymbol) => {
      symbolLookupMap.set(tileSymbol.name, tileSymbol.Component);
    });
    return symbolLookupMap; // We RETURN it, so it becomes the value of 'tileSymbolLookup'
  }, []);
  //(tileName: string) - The Parameter List
  //( and ): Parentheses enclose the function's parameters (its inputs).
  //tileName: The chosen name for the input variable. You will use this name inside the function.
  //: string: A type annotation. The colon : means "of type...". So : string means this input tileName must be a text string.
  const getTileDesign = (tileName: string): SVGComponent | undefined => {
    const result = tileSymbolLookup.get(tileName);
    return result;
  };

  return { getTileDesign };
}
