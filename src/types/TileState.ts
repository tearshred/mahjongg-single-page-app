// Bringing in the metadata from TileProps.ts so we can extend it
import type { TileSymbol } from "./TileProps";

// Creates a new interface that inherits all metadata (name, path, Component)
export interface TileDataWithState extends TileSymbol {
  isSelected: boolean;
  isClicked: boolean;
  isHighlighted: boolean;
  value: string | number;
  position?: {
    // Making the field optional because tiles don't have positions before layout assignment
    layer: number;
    row: number;
    col: number;
  };
}

// Add this new interface to the same file
export interface MahjonggBoardAPI {
  boardTiles: TileDataWithState[];
  selectTile: (tileName: string) => void;
  deselectAllTiles: () => void;
  selectedTileName: string;
  // Add any other functions or values your hook returns
}
