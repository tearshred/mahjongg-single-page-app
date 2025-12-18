import type { TileDataWithState } from "../../types/tile-meta";

// Checks if the tile is free to be selected
export function isTileFree(
    _tile: TileDataWithState,         // The specific tile we're checking for freedom
    _allTiles: TileDataWithState[]    // Complete board state to check blocking relationships
): boolean {
    // Lightweight placeholder implementation for now — always returns true.
    // Replace with actual blocking logic when available.
    return true;
}