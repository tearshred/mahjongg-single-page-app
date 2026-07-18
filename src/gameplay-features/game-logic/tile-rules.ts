import type { TileDataWithState } from "../../types/tile-meta";
import { getTilePlacement, TILE_HEIGHT, TILE_WIDTH } from "../../utils/tilePlacement";
import { isExactTile } from "../../utils/tileUtils";

const TOP_OVERLAP_X = TILE_WIDTH * 0.35;
const TOP_OVERLAP_Y = TILE_HEIGHT * 0.35;
const SIDE_OVERLAP_Y = TILE_HEIGHT * 0.45;
const SIDE_BLOCK_ZONE = TILE_WIDTH * 0.35;

function normalizeTileName(name: string): string {
    return name.replace(/-Dora$/i, "");
}

function getOverlapAmount(startA: number, endA: number, startB: number, endB: number) {
    return Math.max(0, Math.min(endA, endB) - Math.max(startA, startB));
}

function getTileKey(tile: TileDataWithState): string {
    return `${tile.position.layer}-${tile.position.row}-${tile.position.col}`;
}

/**
 * Compute the set of free tile keys in a single O(n²) pass.
 *
 * Tile placements are pre-computed once into a map so each pair-wise
 * overlap check is pure arithmetic — no repeated object allocation.
 * Call this once per state change and use the returned Set for O(1) lookups.
 */
export function computeFreeTileKeys(activeTiles: TileDataWithState[]): Set<string> {
    // Pre-compute every pixel placement exactly once
    const placements = new Map<string, ReturnType<typeof getTilePlacement>>();
    activeTiles.forEach((tile) => {
        placements.set(getTileKey(tile), getTilePlacement(tile.position));
    });

    const freeKeys = new Set<string>();

    activeTiles.forEach((tile) => {
        const key = getTileKey(tile);
        const p = placements.get(key)!;

        let isTopBlocked = false;
        let isLeftBlocked = false;
        let isRightBlocked = false;

        for (const candidate of activeTiles) {
            if (isExactTile(tile, candidate)) continue;

            const cp = placements.get(getTileKey(candidate))!;
            const hOverlap = getOverlapAmount(p.left, p.right, cp.left, cp.right);
            const vOverlap = getOverlapAmount(p.top, p.bottom, cp.top, cp.bottom);

            if (
                candidate.position.layer > tile.position.layer &&
                hOverlap >= TOP_OVERLAP_X &&
                vOverlap >= TOP_OVERLAP_Y
            ) {
                isTopBlocked = true;
                break; // No need to check further once top-blocked
            }

            if (candidate.position.layer === tile.position.layer && vOverlap >= SIDE_OVERLAP_Y) {
                const leftGap = p.left - cp.right;
                const rightGap = cp.left - p.right;
                if (cp.left < p.left && leftGap <= SIDE_BLOCK_ZONE) isLeftBlocked = true;
                if (cp.right > p.right && rightGap <= SIDE_BLOCK_ZONE) isRightBlocked = true;
            }
        }

        if (!isTopBlocked && (!isLeftBlocked || !isRightBlocked)) {
            freeKeys.add(key);
        }
    });

    return freeKeys;
}

// Thin wrapper for tests and one-off checks
export function isTileFree(
    tile: TileDataWithState,
    allTiles: TileDataWithState[]
): boolean {
    const activeTiles = allTiles.filter((t) => !t.isMatched);
    const freeKeys = computeFreeTileKeys(activeTiles);
    return freeKeys.has(getTileKey(tile));
}

export function areTilesMatch(
    firstTile: TileDataWithState,
    secondTile: TileDataWithState
): boolean {
    if (isExactTile(firstTile, secondTile)) {
        return false;
    }

    return firstTile.name === secondTile.name;
}