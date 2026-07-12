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
import { areTilesMatch, computeFreeTileKeys } from "../gameplay-features/game-logic/tile-rules";
import { useHistory } from "../gameplay-features/move-history/useHistory";

const MATCHED_TILE_DISPLAY_MS = 320;

function getTileKey(tile: TileDataWithState): string {
  return `${tile.position.layer}-${tile.position.row}-${tile.position.col}`;
}

function deriveBoardState(
  tiles: TileDataWithState[],
  selectedKey: string | null
): TileDataWithState[] {
  const activeTiles = tiles.filter((tile) => !tile.isMatched);
  const playableKeys = computeFreeTileKeys(activeTiles);
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

  const { recordMove, undo: historyUndo, redo: historyRedo, canUndo, canRedo, undoCount } = useHistory();

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

    const nextClickedTile = boardTiles.find((tile) => getTileKey(tile) === clickedKey);
    if (!nextClickedTile || nextClickedTile.isMatched || !nextClickedTile.isPlayable) return;

    const selectedTile = boardTiles.find((tile) => tile.isSelected && !tile.isMatched) ?? null;

    if (!selectedTile) {
      setBoardTiles(deriveBoardState(boardTiles, clickedKey));
      return;
    }

    if (isExactTile(selectedTile, nextClickedTile)) {
      setBoardTiles(deriveBoardState(boardTiles, null));
      return;
    }

    if (areTilesMatch(selectedTile, nextClickedTile)) {
      const snapshot = boardTiles.filter((t) => !t.isMatched);
      const matchedBoard = boardTiles.map((tile) =>
        isExactTile(tile, selectedTile) || isExactTile(tile, nextClickedTile)
          ? { ...tile, isMatched: true }
          : tile
      );
      setBoardTiles(deriveBoardState(matchedBoard, null));
      recordMove(snapshot);
      scheduleMatchedTileRemoval();
      return;
    }

    setBoardTiles(deriveBoardState(boardTiles, clickedKey));
  };

  const deselectAllTiles = () => {
    setBoardTiles((prev) => deriveBoardState(prev, null));
  };

  const handleUndo = () => {
    if (matchedRemovalTimeoutRef.current !== null) {
      window.clearTimeout(matchedRemovalTimeoutRef.current);
      matchedRemovalTimeoutRef.current = null;
    }
    const restored = historyUndo(boardTiles);
    if (restored) {
      setBoardTiles(deriveBoardState(restored.filter((t) => !t.isMatched), null));
    }
  };

  const handleRedo = () => {
    if (matchedRemovalTimeoutRef.current !== null) {
      window.clearTimeout(matchedRemovalTimeoutRef.current);
      matchedRemovalTimeoutRef.current = null;
    }
    const restored = historyRedo(boardTiles);
    if (restored) {
      // redo restores the pre-filter snapshot; re-apply the filter so the matched pair disappears
      setBoardTiles(deriveBoardState(restored.filter((t) => !t.isMatched), null));
    }
  };

  const selectedTile =
    boardTiles.find((tile) => tile.isSelected) || null;

  return {
    boardTiles,
    selectTile,
    deselectAllTiles,
    selectedTile,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    undoCount,
    totalTileCount: initialTiles.length,
  };
}
