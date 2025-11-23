import type {
  LayoutPosition,
  VirtualGrid,
  GridPosition,
} from "../types/BoardLayouts";

import type { FloatingDirection } from "../types/tile-meta";

// Direction → fractional offsets (fractions of tile size)
const DIRECTION_OFFSETS: Record<FloatingDirection, { offsetX: number; offsetY: number }> = {
  "none": { offsetX: 0, offsetY: 0 },
  "top": { offsetX: 0, offsetY: -0.5 },
  "bottom": { offsetX: 0, offsetY: 0.5 },
  "left": { offsetX: -0.5, offsetY: 0 },
  "right": { offsetX: 0.5, offsetY: 0 },
  "top-left": { offsetX: -0.25, offsetY: -0.5 },
  "top-right": { offsetX: 0.25, offsetY: -0.5 },
  "bottom-left": { offsetX: -0.25, offsetY: 0.5 },
  "bottom-right": { offsetX: 0.25, offsetY: 0.5 },
};

/**
 * Computes virtual grid dimensions for each layer in a layout
 * Analyzes all tile positions to determine the maximum rows and columns needed per layer
 * This creates the "invisible grid" that CSS will use for positioning
 */

export function computeVirtualGrids(
  positions: LayoutPosition[]
): VirtualGrid[] {
  // Group positions by layer to analyze each layer separately
  const positionsByLayer = new Map<number, LayoutPosition[]>();

  // Organize all positions into their respective layers
  positions.forEach((position) => {
    if (!positionsByLayer.has(position.layer)) {
      positionsByLayer.set(position.layer, []);
    }
    positionsByLayer.get(position.layer)!.push(position);
  });

  // Calculate grid dimensions for each layer
  return Array.from(positionsByLayer.entries()).map(
    ([_layer, layerPositions]) => {
      // Find the maximum row and column values in this layer
      // Add 1 because positions are 0-based but counts are 1-based
      const maxRow = Math.max(...layerPositions.map((p) => p.row)) + 1;
      const maxCol = Math.max(...layerPositions.map((p) => p.col)) + 1;

      return {
        columns: maxCol,
        rows: maxRow,
        cellSize: 0, // Will be calculated dynamically in CSS based on screen size
      };
    }
  );
}

/**
 * Counts how many tiles exist in a specific row of a specific layer
 * This is essential for centering rows within their virtual grid
 */
export function getRowTileCount(
  positions: LayoutPosition[],
  targetLayer: number,
  targetRow: number
): number {
  return positions.filter(
    (pos) => pos.layer === targetLayer && pos.row === targetRow
  ).length;
}

/**
 * Transforms a backend layout position into CSS Grid coordinates
 * Handles the centering logic for rows with different tile counts
 * Returns coordinates that are 1-based for direct use in CSS Grid
 */

export function computeGridPosition(
  backendPos: LayoutPosition,
): GridPosition {
  // const startCol = Math.floor((layerGrid.columns - rowTileCount) / 2);

  return {
    row: backendPos.row,                  // ✅ backend row
    col: backendPos.col,                  // ✅ backend col
    gridRow: backendPos.row + 1,
    gridColumn: backendPos.col + 1,
    // We avoid using fractional grid line numbers (invalid in CSS Grid).
    // Instead, always place by the nearest integer grid row and use numeric
    // `offsetY`/`offsetX` to nudge floating tiles between rows.
    gridRowFractional: undefined,
    layer: backendPos.layer,
    floating: backendPos.floating,
    // Derive numeric fractional offsets from direction mapping (defaults to 0)
    offsetX: DIRECTION_OFFSETS[(backendPos.floating ?? 'none') as FloatingDirection].offsetX,
    offsetY: DIRECTION_OFFSETS[(backendPos.floating ?? 'none') as FloatingDirection].offsetY,
  };
}
