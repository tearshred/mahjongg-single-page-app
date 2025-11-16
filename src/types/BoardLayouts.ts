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

export type FloatingPosition = {
    type: 'left' | 'right';
    index: number;  // 0 for left, 13 or 14 for right
};

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

// Purpose: Defines the "invisible grid" for each layer. Layer 0 gets 15×8, Layer 1 gets 6×6, etc.
export interface VirtualGrid {
  columns: number;
  rows: number;
  cellSize: number;
}

// Purpose: Stores the translated position from backend coordinates to CSS Grid coordinates.
export interface GridPosition {
  // Backend coordinates
  layer: number;
  row: number;
  col: number;

  // CSS Grid coordinates for rendering
  gridRow: number;
  gridColumn: number;
  gridRowFractional?: string; // Optional: "4.5 / 5.5" for floating. used for splitting the row for easier rendering

  // Optional offset for floating tiles
  offsetY?: number;

  floating: boolean;
}

// Extends LayoutPosition with virtual grid data for CSS positioning while preserving original coordinates
export interface EnhancedLayoutPosition extends LayoutPosition {
  virtualPosition?: GridPosition; // The CSS Grid position
  rowLength?: number; // How many tiles in this specific row
}
