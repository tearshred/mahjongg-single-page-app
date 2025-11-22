import type { Grid3D } from "../../types/game-logic";
import { createEmptyLayer, markTilesInLayer, STANDARD_GRID } from "../game-logic/grid-system";

// types
export type LayerRow = number[];      // Columns with tiles
export type LayerGrid = LayerRow[];   // Array of rows
export type LayoutGrid = LayerGrid[]; // All layers

// Explicit grid dimensions for turtle layout
export const turtleGridDimensions = {
  columns: 15,  // 0-14
  rows: 8,      // 0-7
};

// 
// NEW: Create layer 0 using grid system
function createLayer0(): Grid3D[0] {  // Returns one GridLayer (8×15 boolean grid)
  // Step 1: Create empty 8×15 grid (all false)
  const emptyLayer = createEmptyLayer(STANDARD_GRID.rows, STANDARD_GRID.columns);
  
  // Step 2: Define where tiles go (converting from your bottomLayer)
  const tilePositions = [
    // Row 0: columns 1-12 (tiles in positions 1,2,3,4,5,6,7,8,9,10,11,12)
    // Empty: 0, 13, 14
    ...Array.from({ length: 12 }, (_, i) => ({ row: 0, col: i + 1 })),
    
    // Row 1: columns 3-10 (tiles in positions 3,4,5,6,7,8,9,10)
    // Empty: 0, 1, 2, 11, 12, 13, 14
    ...Array.from({ length: 8 }, (_, i) => ({ row: 1, col: i + 3 })),
    
    // Row 2: columns 2-11 (tiles in positions 2,3,4,5,6,7,8,9,10,11)
    // Empty: 0, 1, 12, 13, 14
    ...Array.from({ length: 10 }, (_, i) => ({ row: 2, col: i + 2 })),
    
    // Row 3: columns 1-12 (tiles in positions 1,2,3,4,5,6,7,8,9,10,11,12)
    // Empty: 0, 13, 14
    ...Array.from({ length: 12 }, (_, i) => ({ row: 3, col: i + 1 })),
    
    // Row 4: columns 0-14 (ALL positions have tiles, including 3 floating)
    // Regular tiles: 1-12
    ...Array.from({ length: 12 }, (_, i) => ({ row: 4, col: i + 1 })),
    // Floating tiles: 0, 13, 14
    { row: 4, col: 0, floating: true },
    { row: 4, col: 13, floating: true },
    { row: 4, col: 14, floating: true },
    
    // Row 5: columns 2-11 (tiles in positions 2,3,4,5,6,7,8,9,10,11)
    // Empty: 0, 1, 12, 13, 14
    ...Array.from({ length: 10 }, (_, i) => ({ row: 5, col: i + 2 })),
    
    // Row 6: columns 3-10 (tiles in positions 3,4,5,6,7,8,9,10)
    // Empty: 0, 1, 2, 11, 12, 13, 14
    ...Array.from({ length: 8 }, (_, i) => ({ row: 6, col: i + 3 })),
    
    // Row 7: columns 1-12 (tiles in positions 1,2,3,4,5,6,7,8,9,10,11,12)
    // Empty: 0, 13, 14
    ...Array.from({ length: 12 }, (_, i) => ({ row: 7, col: i + 1 })),
  ];
  
  // Step 3: Mark those positions as true
  return markTilesInLayer(emptyLayer, tilePositions);
}

// NEW: Create layer 1 using grid system (6x6 centered)
function createLayer1(): Grid3D[1] {
  const emptyLayer = createEmptyLayer(STANDARD_GRID.rows, STANDARD_GRID.columns);
  
  // Layer 1: 6x6 centered in 8x15 grid
  // Rows: 1-6 (centered vertically)
  // Cols: 4-9 (centered horizontally)
  const tilePositions = [];
  for (let row = 1; row <= 6; row++) {
    for (let col = 4; col <= 9; col++) {
      tilePositions.push({ row, col });
    }
  }
  
  return markTilesInLayer(emptyLayer, tilePositions);
}

// NEW: Create layer 2 using grid system (4x4 centered)
function createLayer2(): Grid3D[2] {
  const emptyLayer = createEmptyLayer(STANDARD_GRID.rows, STANDARD_GRID.columns);
  
  // Layer 2: 4x4 centered in 8x15 grid
  // Rows: 2-5 (centered vertically)
  // Cols: 5-8 (centered horizontally)
  const tilePositions = [];
  for (let row = 2; row <= 5; row++) {
    for (let col = 5; col <= 8; col++) {
      tilePositions.push({ row, col });
    }
  }
  
  return markTilesInLayer(emptyLayer, tilePositions);
}

// NEW: Create layer 3 using grid system (2x2 centered)
function createLayer3(): Grid3D[3] {
  const emptyLayer = createEmptyLayer(STANDARD_GRID.rows, STANDARD_GRID.columns);
  
  // Layer 3: 2x2 centered in 8x15 grid
  // Rows: 3-4 (centered vertically)
  // Cols: 6-7 (centered horizontally)
  const tilePositions = [
    { row: 3, col: 6 }, { row: 3, col: 7 },
    { row: 4, col: 6 }, { row: 4, col: 7 }
  ];
  
  return markTilesInLayer(emptyLayer, tilePositions);
}

// NEW: Create layer 4 using grid system (1x1 centered)
function createLayer4(): Grid3D[4] {
  const emptyLayer = createEmptyLayer(STANDARD_GRID.rows, STANDARD_GRID.columns);
  
  // Layer 4: 1x1 centered in 8x15 grid
  // Row: 3 (center of 0-7)
  // Col: 7 (center of 0-14)
  const tilePositions = [
    { row: 3, col: 7 }
  ];
  
  return markTilesInLayer(emptyLayer, tilePositions);
}

// Grid system format - Returns Grid3D (5 layers of 8x15 grids)
export const turtleLayout = (): Grid3D => {
  return [
    createLayer0(),
    createLayer1(),
    createLayer2(),
    createLayer3(),
    createLayer4()
  ];
};