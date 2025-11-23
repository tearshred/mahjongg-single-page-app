import type { TileDataWithState } from "../tile-meta";

/**
 * Result of attempting to match two tiles.
 * This is a VALIDATION result - tells you if the match can happen.
 * Returned by the attemptMatch() function before any tiles are removed.
 */
export interface TileMatchResult {
    success: boolean;
    reason?: 'not-free' | 'same-tile' | 'no-match' | 'success';
}

// Is tile blocked and what is blocking it
export interface TileBlocked {
    isLeftBlocked: boolean,
    isRightBlocked: boolean,
    isTopBlocked: boolean,
    blockedBy: TileDataWithState[]
}