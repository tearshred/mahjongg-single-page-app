import type { TileDataWithState } from "../types/tile-meta";

export const isExactTile = (
    clickedTile: TileDataWithState,   // The tile the user clicked
    boardTile: TileDataWithState    // The tile from the board we are checking
) : boolean => {
    return (
        // Compare positions in order to know which tile is exactly being clicked
        // The reason behind this is to eliminate selecting/highlighting ALL tiles with the same name
        // For example: select only tile "Sou9" located at layer0, col2, row3...
        clickedTile.position.layer === boardTile.position.layer &&
        clickedTile.position.row === boardTile.position.row &&
        clickedTile.position.col === boardTile.position.col
    )
};