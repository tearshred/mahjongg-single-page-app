// Types for the grid system
// GridCell: A single cell in the grid - either has a tile (a literal 'tile'),
// a floating direction string (when a tile should float and we want to preserve direction),
// or 'empty' when no tile is present.
import type { FloatingDirection } from '../tile-meta';
export type GridCell = 'tile' | FloatingDirection | 'empty';  // 'tile' or a floating direction string

// GridLayer: A 2D array representing one layer (like one battleship board)
// Structure: GridCell[][] means "array of arrays of booleans"
// Example: [[false, true, false], [true, true, false]] = 2 rows, 3 columns
export type GridLayer = GridCell[][];  // [rows][cols]

// Grid3D: A 3D array representing all layers stacked together
// Structure: GridLayer[] means "array of GridLayers"
// This is the full grid: 5 layers, each with 8 rows and 15 columns
export type Grid3D = GridLayer[];  // [layers][rows][cols]

// Tile position with optional floating flag
// This type defines the coordinates of a single tile in the 3D grid
export type GridTilePosition = {
  layer: number;    // Which layer (0-4)
  row: number;      // Which row within that layer (0-7)
  col: number;      // Which column within that layer (0-14)
  // Optional: stores the floating direction for this tile when applicable.
  floating?: FloatingDirection;
};
