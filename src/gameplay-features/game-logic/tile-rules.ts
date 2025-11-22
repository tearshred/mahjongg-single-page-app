import type { TileDataWithState } from "../../types/TileState";
import type { TileBlocked } from "../../types/game-logic";

// Checks if the tile is free to be selected
export function isTileFree(
    tile: TileDataWithState,         // The specific tile we're checking for freedom
    allTiles: TileDataWithState[]    // Complete board state to check blocking relationships
) : boolean {

}