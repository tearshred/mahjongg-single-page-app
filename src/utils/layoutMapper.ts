import type { LayoutPosition, VirtualGrid, GridPosition } from "../types/BoardLayouts";

/**
 * Computes virtual grid dimensions for each layer in a layout
 * Analyzes all tile positions to determine the maximum rows and columns needed per layer
 * This creates the "invisible grid" that CSS will use for positioning
 */

export function computeVirtualGrids(positions: LayoutPosition[]): VirtualGrid[] {
  // Group positions by layer to analyze each layer separately
  const positionsByLayer = new Map<number, LayoutPosition[]>();
  
  // Organize all positions into their respective layers
  positions.forEach(position => {
    if (!positionsByLayer.has(position.layer)) {
      positionsByLayer.set(position.layer, []);
    }
    positionsByLayer.get(position.layer)!.push(position);
  });

  // Calculate grid dimensions for each layer
  return Array.from(positionsByLayer.entries()).map(([layer, layerPositions]) => {
    // Find the maximum row and column values in this layer
    // Add 1 because positions are 0-based but counts are 1-based
    const maxRow = Math.max(...layerPositions.map(p => p.row)) + 1;
    const maxCol = Math.max(...layerPositions.map(p => p.col)) + 1;
    
    return {
      columns: maxCol,
      rows: maxRow,
      cellSize: 0 // Will be calculated dynamically in CSS based on screen size
    };
  });
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
  return positions.filter(pos => 
    pos.layer === targetLayer && pos.row === targetRow
  ).length;
}

/**
 * Transforms a backend layout position into CSS Grid coordinates
 * Handles the centering logic for rows with different tile counts
 * Returns coordinates that are 1-based for direct use in CSS Grid
 */
export function computeGridPosition(
  backendPos: LayoutPosition,
  rowTileCount: number,
  layerGrid: VirtualGrid
): GridPosition {
  // Calculate starting column to center the row within the virtual grid
  // Example: For a row with 8 tiles in a 15-column grid: (15 - 8) / 2 = 3.5 → floor to 3
  const startCol = Math.floor((layerGrid.columns - rowTileCount) / 2);
  
  // Convert to 1-based CSS Grid coordinates and apply centering offset
  return {
    gridRow: backendPos.row + 1,                    // CSS Grid rows are 1-based
    gridColumn: startCol + backendPos.col + 1,      // Apply centering + 1-based conversion
    layer: backendPos.layer
  };
}