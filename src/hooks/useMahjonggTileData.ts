// See hooks-explained.md for more detailed explanation

import { useMemo } from "react";
import type { Tile, TileName } from "../types/Tile";
import type { FC } from "react";
import { loadTiles,loadSharedTiles } from "../utils/tileLoader";

// Imports all SVGs from the tiles folder as React components
const tileData = loadTiles();
const tileBase = loadSharedTiles();

export function generateTileData(tileData: Tile[]): TileName[] {
  // Extract tile names and put them inside the TileName array of strings
  const tileNames: TileName[] = tileData.map((tile) => tile.name);

  return tileNames;
}

export function useMahjonggTileData(): Tile[] {
  const tileCache: Tile[] = useMemo(() => {
    const allTiles = { ...loadSharedTiles(), ...loadTiles() };
    return Object.entries(allTiles).map(([fullPath, Component]) => {
      const fileName = fullPath.split("/").pop()!.replace(".svg", "");

      return { name: fileName, Component: Component as FC };
    });
  }, [tileData]);

  generateTileData(tileCache);

  return tileCache;
}
