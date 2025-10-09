// types/BoardLayouts.ts

/**
 * Represents the position of a single tile on the board.
 * Can be extended with additional properties as needed.
 */
export interface LayoutPosition {
  layer: number;
  row: number;
  col: number;
  [key: string]: any; // For extra metadata like tile ID, highlight, etc.
}

// Allowed layout names
export type LayoutName = "turtle"; // Extendable later

export interface BoardLayoutOptions {
  layout?: LayoutName;
}

/**
 * Optional: Represents a full grid for a layer.
 * Each cell can be undefined (empty) or a LayoutPosition reference.
 */
export type LayerGrid = (LayoutPosition | undefined)[][];

// Optional: default board shape type
export interface BoardShape {
  maxLayers: number;
  baseRows: number;
  baseCols: number;
}

// Default shape for turtle layout
export const DEFAULT_TURTLE_SHAPE: BoardShape = {
  maxLayers: 5,
  baseRows: 8,
  baseCols: 10,
};