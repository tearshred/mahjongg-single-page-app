import { useEffect, useMemo, useRef, useState } from "react";
import { useMahjonggTileData } from "./useMahjonggTileData";
import type { TileDataWithState } from "../types/tile-meta";
import type { MahjonggBoardAPI } from "../types/BoardAPI";
import { useLayoutConfig } from "./useLayoutConfig";
import {
  computeVirtualGrids,
  computeGridPosition,
} from "../utils/layoutMapper";
import { assignRandomTiles } from "../utils/tileRandomizer"; // ✅ added
import { isExactTile } from "../utils/tileUtils";
import { areTilesMatch, isTileFree, hasSolvableMove } from "../gameplay-features/game-logic/tile-rules";

const MATCHED_TILE_DISPLAY_MS = 320;

function getTileKey(tile: TileDataWithState): string {
  return `${tile.position.layer}-${tile.position.row}-${tile.position.col}`;
}

function deriveBoardState(
  tiles: TileDataWithState[],
  selectedKey: string | null
): TileDataWithState[] {
  const activeTiles = tiles.filter((tile) => !tile.isMatched);
  const playableKeys = new Set(
    activeTiles
      .filter((tile) => isTileFree(tile, activeTiles))
      .map((tile) => getTileKey(tile))
  );
  const selectedTile = selectedKey
    ? activeTiles.find((tile) => getTileKey(tile) === selectedKey && playableKeys.has(selectedKey)) ?? null
    : null;

  return tiles.map((tile) => {
    if (tile.isMatched) {
      return {
        ...tile,
        isSelected: false,
        isHighlighted: false,
        isPlayable: false,
        isMatchCandidate: false,
      };
    }

    const tileKey = getTileKey(tile);
    const isPlayable = playableKeys.has(tileKey);
    const isSelected = selectedTile ? tileKey === getTileKey(selectedTile) : false;
    const isMatchCandidate =
      !!selectedTile &&
      tileKey !== getTileKey(selectedTile) &&
      isPlayable &&
      areTilesMatch(selectedTile, tile);

    return {
      ...tile,
      isSelected,
      isHighlighted: isPlayable,
      isPlayable,
      isMatchCandidate,
    };
  });
}

// Tells TypeScript: "This function promises to return an object that
// matches the MahjonggBoardAPI structure."
export function useMahjonggBoard(): MahjonggBoardAPI {
  // 1. Load tile metadata. Storing the list of tiles inside the `tileData` variable
  const tileData = useMahjonggTileData();

  // 2. Get layout configuration (includes memoized positions)
  // Get just the positions instead of getting everything and then extract, explanation:
  // const allConfig = useLayoutConfig();      
  // const positions = allConfig.positions; 
  // The destructuring is a convenient shortcut for "I only want this one thing from the returned object"!
  const { positions } = useLayoutConfig();

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
  const [boardTiles, setBoardTiles] = useState<TileDataWithState[]>(() =>
    deriveBoardState(initialTiles, null)
  );
  const matchedRemovalTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (matchedRemovalTimeoutRef.current !== null) {
        window.clearTimeout(matchedRemovalTimeoutRef.current);
      }
    };
  }, []);

  const scheduleMatchedTileRemoval = () => {
    if (matchedRemovalTimeoutRef.current !== null) {
      window.clearTimeout(matchedRemovalTimeoutRef.current);
    }

    matchedRemovalTimeoutRef.current = window.setTimeout(() => {
      setBoardTiles((prev) => deriveBoardState(prev.filter((tile) => !tile.isMatched), null));
      matchedRemovalTimeoutRef.current = null;
    }, MATCHED_TILE_DISPLAY_MS);
  };

  // 6️⃣ Selection API
  const selectTile = (clickedTile: TileDataWithState) => {
    const clickedKey = getTileKey(clickedTile);
    let shouldRemoveMatchedTiles = false;

    setBoardTiles((prev) => {
      const nextClickedTile = prev.find((tile) => getTileKey(tile) === clickedKey);

      if (!nextClickedTile || nextClickedTile.isMatched || !nextClickedTile.isPlayable) {
        return prev;
      }

      const selectedTile = prev.find((tile) => tile.isSelected && !tile.isMatched) ?? null;

      if (!selectedTile) {
        return deriveBoardState(prev, clickedKey);
      }

      if (isExactTile(selectedTile, nextClickedTile)) {
        return deriveBoardState(prev, null);
      }

      if (areTilesMatch(selectedTile, nextClickedTile)) {
        shouldRemoveMatchedTiles = true;
        const matchedBoard = prev.map((tile) => {
          if (isExactTile(tile, selectedTile) || isExactTile(tile, nextClickedTile)) {
            return {
              ...tile,
              isMatched: true,
            };
          }

          return tile;
        });

        return deriveBoardState(matchedBoard, null);
      }

      return deriveBoardState(prev, clickedKey);
    });

    if (shouldRemoveMatchedTiles) {
      scheduleMatchedTileRemoval();
    }
  };

  const deselectAllTiles = () => {
    setBoardTiles((prev) => deriveBoardState(prev, null));
  };

  const selectedTile =
    boardTiles.find((tile) => tile.isSelected) || null;

  const hasAnyMove = hasSolvableMove(boardTiles);

  return {
    boardTiles,
    selectTile,
    deselectAllTiles,
    selectedTile,
    hasAnyMove,
  };
}
