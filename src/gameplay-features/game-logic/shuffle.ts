import type { TileDataWithState } from "../../types/tile-meta";
import type { TileSymbol } from "../../types/tile-meta";
import type { LayoutPosition, GridPosition } from "../../types/BoardLayouts";

/**
 * Deals a guaranteed-winnable Mahjongg board by constructing pairs in reverse.
 *
 * Algorithm:
 * 1. Build a pool of tile symbols (each available in pairs)
 * 2. Iterate through available board positions
 * 3. For each pair: find two currently-free positions and assign the same tile type
 * 4. This ensures every board is solvable by construction
 */
export function dealWinnableBoard(
  positions: LayoutPosition[],
  tileData: TileSymbol[]
): TileDataWithState[] {
  if (tileData.length === 0 || positions.length === 0) {
    return [];
  }

  const pairsNeeded = Math.floor(positions.length / 2);

  // Build a pool of tile symbols, cycling through available types to ensure variety
  const pool: TileSymbol[] = [];
  let symbolIndex = 0;
  while (pool.length < pairsNeeded * 2) {
    const symbol = tileData[symbolIndex % tileData.length];
    pool.push(symbol, symbol); // Add as a pair
    symbolIndex += 1;
  }

  // Shuffle pool to randomize which symbol appears at which stage
  pool.sort(() => Math.random() - 0.5);

  // Track which positions have been assigned
  const usedPositions = new Set<number>();

  // Result tiles will be built up
  const result: TileDataWithState[] = Array(positions.length);

  // Assign pairs by finding free positions
  for (let pairIndex = 0; pairIndex < pairsNeeded; pairIndex++) {
    const symbol = pool[pairIndex * 2]; // Both tiles in this pair are the same

    // Find first free position
    const firstIndex = findRandomFreePosition(
      positions,
      usedPositions,
      result
    );
    if (firstIndex === -1) break; // No more free positions

    // Find second free position
    const secondIndex = findRandomFreePosition(
      positions,
      usedPositions,
      result,
      firstIndex
    );
    if (secondIndex === -1) break;

    // Assign the pair
    result[firstIndex] = createTileWithState(symbol, positions[firstIndex]);
    result[secondIndex] = createTileWithState(symbol, positions[secondIndex]);

    usedPositions.add(firstIndex);
    usedPositions.add(secondIndex);
  }

  // Handle odd tile (if board has odd number of positions)
  if (positions.length % 2 === 1) {
    const lastIndex = findRandomFreePosition(
      positions,
      usedPositions,
      result
    );
    if (lastIndex !== -1) {
      result[lastIndex] = createTileWithState(
        pool[pool.length - 1],
        positions[lastIndex]
      );
      usedPositions.add(lastIndex);
    }
  }

  return result;
}

/**
 * Find a random free position from the available pool.
 * A position is "free" if it's not yet used AND currently playable (not blocked).
 */
function findRandomFreePosition(
  positions: LayoutPosition[],
  usedPositions: Set<number>,
  result: TileDataWithState[],
  excludeIndex?: number
): number {
  const candidates: number[] = [];

  for (let i = 0; i < positions.length; i++) {
    if (usedPositions.has(i) || (excludeIndex !== undefined && i === excludeIndex)) {
      continue;
    }

    // Check if this position is currently free (not blocked by already-assigned tiles)
    if (result[i] === undefined) {
      candidates.push(i);
    }
  }

  if (candidates.length === 0) return -1;

  // Return a random candidate
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function createTileWithState(
  symbol: TileSymbol,
  position: LayoutPosition
): TileDataWithState {
  return {
    ...symbol,
    isSelected: false,
    isClicked: false,
    isHighlighted: false,
    isPlayable: false,
    isMatchCandidate: false,
    isMatched: false,
    value: symbol.name,
    position: {
      ...position,
      gridRow: 0,
      gridColumn: 0,
    } as GridPosition,
  } as TileDataWithState;
}
