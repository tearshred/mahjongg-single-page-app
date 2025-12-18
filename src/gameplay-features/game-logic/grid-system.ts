import type { GridLayer, Grid3D, GridTilePosition } from '../../types/game-logic';
import type { FloatingDirection } from '../../types/tile-meta';

// Standard grid dimensions (can be customized per layout)
// This is a constant object that stores the default size of our 3D grid
export const STANDARD_GRID = {
  rows: 8,        // Number of rows in each layer (0-7)
  columns: 15,    // Number of columns in each layer (0-14)
  layers: 5       // Number of layers stacked vertically (0-4)
};


// Create an empty layer (all cells 'empty')
// This function creates a single 2D grid filled with 'empty' (no tiles)
// Parameters: rows = how many rows, cols = how many columns
// Returns: A 2D array (GridLayer) where every cell is 'empty'
export function createEmptyLayer(rows: number, cols: number): GridLayer {
  // Array.from({ length: rows }, ...) creates an array with 'rows' elements
  // For each element, the arrow function () => ... is called
  // Array(cols).fill('empty') creates an array of 'cols' elements, all set to 'empty'
  // Result: An array of 'rows' arrays, each containing 'cols' 'empty' values
  return Array.from({ length: rows }, () => Array(cols).fill('empty'));
}

// Create a full 3D grid (all layers empty)
// This function creates ALL layers at once, each one empty
// Parameters: layers = how many layers, rows = rows per layer, cols = columns per layer
// Returns: A 3D array (Grid3D) with all cells set to 'empty'
export function create3DGrid(layers: number, rows: number, cols: number): Grid3D {
  // Array.from({ length: layers }, ...) creates an array with 'layers' elements
  // For each element, it calls createEmptyLayer(rows, cols)
  // Result: An array of 'layers' GridLayers, each one empty (8x15 of 'empty' values)
  return Array.from({ length: layers }, () => createEmptyLayer(rows, cols));
}

// Mark specific positions as tiles in a layer
// This function takes an empty layer and marks certain positions as 'tile' or 'floating'
// Parameters: 
//   - layer: The GridLayer to modify (2D array of GridCell strings)
//   - positions: Array of {row, col, floating?} objects indicating where to place tiles
// Returns: A new GridLayer with the specified positions marked as 'tile' or 'floating'
export function markTilesInLayer(
  layer: GridLayer,
  positions: { row: number; col: number; floating?: boolean | FloatingDirection }[]
): GridLayer {
  // Deep copy: Create a copy of the layer to avoid modifying the original
  // layer.map(row => [...row]) means:
  //   - For each row in the layer
  //   - Create a new array [...row] that copies all values from that row
  //   - This creates a completely new 2D array with the same values
  const newLayer = layer.map(row => [...row]);  // Deep copy
  
  // Loop through each position we want to mark
  // positions.forEach() runs the arrow function for each position object
  // { row, col, floating } destructures the position object to get row, col, and floating flag
  positions.forEach(({ row, col, floating }) => {
    // Validation: Check if the position is within the grid boundaries
    // row >= 0: row is not negative
    // row < newLayer.length: row doesn't exceed the number of rows (0-7)
    // col >= 0: column is not negative
    // col < newLayer[0].length: column doesn't exceed the number of columns (0-14)
    if (row >= 0 && row < newLayer.length && col >= 0 && col < newLayer[0].length) {
      // Store the floating direction string if provided, otherwise mark as 'floating' (legacy)
      if (floating) {
        newLayer[row][col] = typeof floating === 'string' ? floating : 'top';
      } else {
        newLayer[row][col] = 'tile';
      }
    }
  });
  
  // Return the modified layer
  return newLayer;
}

// Extract all tile positions from a 3D grid (flatten to positions)
// This function scans the entire 3D grid and finds all cells marked as 'tile' or 'floating'
// It converts the grid structure into a flat list of position objects
// Parameters: grid = the full Grid3D to scan
// Returns: Array of GridTilePosition objects (one for each tile found)
export function extractTilePositions(grid: Grid3D): GridTilePosition[] {
  // Create an empty array to store all the positions we find
  const positions: GridTilePosition[] = [];
  
  // Loop through each layer in the 3D grid
  // grid.forEach((layer, layerIndex) => ...) runs the function for each layer
  // 'layer' = the current layer (GridLayer), 'layerIndex' = which layer (0-4)
  grid.forEach((layer, layerIndex) => {
    // Loop through each row in the current layer
    // layer.forEach((row, rowIndex) => ...) runs the function for each row
    // 'row' = the current row (array of GridCell strings), 'rowIndex' = which row (0-7)
    layer.forEach((row, rowIndex) => {
      // Loop through each cell in the current row
      // row.forEach((cellValue, colIndex) => ...) runs the function for each cell
      // 'cellValue' = the cell value ('tile', 'floating', or 'empty'), 'colIndex' = which column (0-14)
      row.forEach((cellValue, colIndex) => {
        // Check if this cell has a tile (is 'tile' or 'floating', not 'empty')
        if (cellValue !== 'empty') {
          // Add this tile's position to our array
          // Determine floating direction (if any). If the grid cell stores a direction
          // string we preserve it. If it contains the legacy 'floating' marker we
          // map it to a default direction ('top'). If it's 'tile' we omit floating.
          // Normalize cellValue to a string for safe runtime checks (covers legacy markers)
          const cellStr = String(cellValue);
          let floating: FloatingDirection | undefined;
          if (cellStr === 'tile') {
            floating = undefined;
          } else if (cellStr === 'floating') {
            // Legacy marker: map to a sensible default
            floating = 'top';
          } else if (cellStr !== 'empty') {
            floating = cellStr as FloatingDirection;
          } else {
            floating = undefined;
          }

          positions.push({
            layer: layerIndex,
            row: rowIndex,
            col: colIndex,
            floating,
          });
        }
      });
    });
  });
  
  // Return the complete list of all tile positions
  return positions;
}