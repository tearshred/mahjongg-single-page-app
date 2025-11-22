// Bringing in the metadata from TileProps.ts so we can extend it
import type { TileSymbol } from "./TileProps";
import type { GridPosition } from "./BoardLayouts";

/** Directional offset for exposed/floating tiles */
export type FloatingDirection = "none" | "top" | "bottom" | "left" | "right";

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