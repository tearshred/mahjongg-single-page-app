import type { TileSymbol } from "./TileUiProps";
import type { GridPosition } from "../BoardLayouts";
import type { FloatingDirection } from "./shared";

// Creates a new interface that inherits all metadata (name, path, Component)
export interface TileDataWithState extends TileSymbol {
  isSelected: boolean;
  isClicked: boolean;
  isHighlighted: boolean;
  floating?: FloatingDirection;
  value: string | number;
  position: GridPosition;
}

export interface MahjonggBoardAPI {
  boardTiles: TileDataWithState[];
  selectTile: (tileName: string) => void;
  deselectAllTiles: () => void;
  selectedTileName: string;
  // Add any other functions or values your hook returns
}

export interface TileSize {
  width: number;
  height: number;
}
