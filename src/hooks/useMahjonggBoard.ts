import { useState, useMemo } from "react";
import { useMahjonggTileData } from "./useMahjonggTileData";
import type { TileDataWithState } from "../types/TileState";
import type { MahjonggBoardAPI } from "../types/BoardAPI";
import { generateTurtleLayout } from "../gameplay-features/game-logic/layout-builder";
import {
  computeVirtualGrids,
  computeGridPosition,
} from "../utils/layoutMapper";
import { assignRandomTiles } from "../utils/tileRandomizer"; // ✅ added
import { isExactTile } from "../utils/tileUtils";

// Tells TypeScript: "This function promises to return an object that
// matches the MahjonggBoardAPI structure."
export function useMahjonggBoard(): MahjonggBoardAPI {
  // 1. Load tile metadata. Storing the list of tiles inside the `tileData` variable
  const tileData = useMahjonggTileData();

  // 2. Generate the backend layout positions (row, col, layer)
  const positions = useMemo(() => generateTurtleLayout(), []);

  // 3. Compute virtual grids for each layer
  //    - This defines the invisible grid structure per layer
  const virtualGrids = useMemo(() => computeVirtualGrids(positions), [positions]);

  // 4. Merge metadata + UI state + backend positions
  // ✅ assignRandomTiles handles random tile assignment for all positions
  const initialTiles = useMemo(() => {
    const tilesWithRandom = assignRandomTiles(positions, tileData);

    return tilesWithRandom.map((tile, index) => {
      const backendPos = positions[index];
      const gridPos = computeGridPosition(backendPos);

      const tileWithState: TileDataWithState = {
        ...tile,
        position: {
          ...backendPos, // backend coordinates
          ...gridPos, // CSS Grid coordinates
        },
      };

      return tileWithState;
    });
  }, [positions, tileData, virtualGrids]);

  // 5. React state for board tiles
  const [boardTiles, setBoardTiles] =
    useState<TileDataWithState[]>(initialTiles);

  // 6️⃣ Selection API
  const selectTile = (clickedTile: TileDataWithState) => {
    setBoardTiles((prev) =>
      prev.map((tile) => {
      if (isExactTile(clickedTile, tile)) {
        return {
          ...tile,
          isSelected: !tile.isSelected,
          isHighlighted: true,  // Add highlighting here
        };
      }
      return tile;
    })
    );
  };

  const deselectAllTiles = () => {
    setBoardTiles((prev) =>
      prev.map((tile) => ({ ...tile, isSelected: false }))
    );
  };

  const selectedTile =
    boardTiles.find((tile) => tile.isSelected) || null;

  return {
    boardTiles,
    selectTile,
    deselectAllTiles,
    selectedTile,
  };
}
