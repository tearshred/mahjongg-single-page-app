import type { TileDataWithState } from "../../types/tile-meta";
import { isExactTile } from "../../utils/tileUtils";

function normalizeTileName(name: string): string {
    return name.replace(/-Dora$/i, "");
}

// Build a position lookup map for O(1) checks instead of O(n²) geometry
function buildPositionMap(
    tiles: TileDataWithState[]
): Map<string, TileDataWithState> {
    const map = new Map<string, TileDataWithState>();
    tiles.forEach((tile) => {
        if (!tile.isMatched) {
            const key = `${tile.position.layer},${tile.position.row},${tile.position.col}`;
            map.set(key, tile);
        }
    });
    return map;
}

// Grid-based free check: O(1) instead of O(n²)
// A tile is free if:
// 1. Nothing is directly above it (no tile at higher layer with same row/col)
// 2. On same layer: either left OR right is open (not pinched between two tiles)
export function isTileFree(
    tile: TileDataWithState,
    allTiles: TileDataWithState[]
): boolean {
    const posMap = buildPositionMap(allTiles);
    const { layer, row, col } = tile.position;

    // Check if blocked from above: any unmatched tile at higher layer, same row/col
    for (let checkLayer = layer + 1; checkLayer < 10; checkLayer++) {
        if (posMap.has(`${checkLayer},${row},${col}`)) {
            return false;
        }
    }

    // Check same-layer blocking: is this tile pinched between left AND right neighbors?
    const leftBlocked = posMap.has(`${layer},${row},${col - 1}`);
    const rightBlocked = posMap.has(`${layer},${row},${col + 1}`);

    // Free if at least one side is open, OR neither side has a neighbor
    return !(leftBlocked && rightBlocked);
}

export function areTilesMatch(
    firstTile: TileDataWithState,
    secondTile: TileDataWithState
): boolean {
    if (isExactTile(firstTile, secondTile)) {
        return false;
    }

    return normalizeTileName(firstTile.name) === normalizeTileName(secondTile.name);
}