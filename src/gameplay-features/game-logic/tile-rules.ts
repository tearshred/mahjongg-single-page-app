import type { TileDataWithState } from "../../types/tile-meta";
import { getTilePlacement, TILE_HEIGHT, TILE_WIDTH } from "../../utils/tilePlacement";
import { isExactTile } from "../../utils/tileUtils";
import type { TileBlocked } from "../../types/game-logic";

const TOP_OVERLAP_X = TILE_WIDTH * 0.35;
const TOP_OVERLAP_Y = TILE_HEIGHT * 0.35;
const SIDE_OVERLAP_Y = TILE_HEIGHT * 0.45;
const SIDE_BLOCK_ZONE = TILE_WIDTH * 0.35;

function getOverlapAmount(startA: number, endA: number, startB: number, endB: number) {
    return Math.max(0, Math.min(endA, endB) - Math.max(startA, startB));
}

function normalizeTileName(name: string): string {
    return name.replace(/-Dora$/i, "");
}

export function computeTileBlockers(
    tile: TileDataWithState,
    allTiles: TileDataWithState[]
): TileBlocked {
    const tilePlacement = getTilePlacement(tile.position);
    const blockedBy: TileDataWithState[] = [];
    let isLeftBlocked = false;
    let isRightBlocked = false;
    let isTopBlocked = false;

    allTiles.forEach((candidate) => {
        if (candidate.isMatched || isExactTile(tile, candidate)) {
            return;
        }

        const candidatePlacement = getTilePlacement(candidate.position);
        const horizontalOverlap = getOverlapAmount(
            tilePlacement.left,
            tilePlacement.right,
            candidatePlacement.left,
            candidatePlacement.right
        );
        const verticalOverlap = getOverlapAmount(
            tilePlacement.top,
            tilePlacement.bottom,
            candidatePlacement.top,
            candidatePlacement.bottom
        );

        let doesBlock = false;

        if (
            candidate.position.layer > tile.position.layer &&
            horizontalOverlap >= TOP_OVERLAP_X &&
            verticalOverlap >= TOP_OVERLAP_Y
        ) {
            isTopBlocked = true;
            doesBlock = true;
        }

        if (candidate.position.layer === tile.position.layer && verticalOverlap >= SIDE_OVERLAP_Y) {
            const leftGap = tilePlacement.left - candidatePlacement.right;
            const rightGap = candidatePlacement.left - tilePlacement.right;

            if (
                candidatePlacement.left < tilePlacement.left &&
                leftGap <= SIDE_BLOCK_ZONE
            ) {
                isLeftBlocked = true;
                doesBlock = true;
            }

            if (
                candidatePlacement.right > tilePlacement.right &&
                rightGap <= SIDE_BLOCK_ZONE
            ) {
                isRightBlocked = true;
                doesBlock = true;
            }
        }

        if (doesBlock) {
            blockedBy.push(candidate);
        }
    });

    return {
        isLeftBlocked,
        isRightBlocked,
        isTopBlocked,
        blockedBy,
    };
}

// Checks if the tile is free to be selected
export function isTileFree(
    tile: TileDataWithState,
    allTiles: TileDataWithState[]
): boolean {
    const blockers = computeTileBlockers(tile, allTiles);
    return !blockers.isTopBlocked && (!blockers.isLeftBlocked || !blockers.isRightBlocked);
}

export function areTilesMatch(firstTile: TileDataWithState, secondTile: TileDataWithState): boolean {
    if (isExactTile(firstTile, secondTile)) {
        return false;
    }

    return normalizeTileName(firstTile.name) === normalizeTileName(secondTile.name);
}