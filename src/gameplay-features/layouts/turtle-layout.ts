import type { LayoutPosition } from "../../types/BoardLayouts";

// types
export type LayerRow = number[];      // Columns with tiles
export type LayerGrid = LayerRow[];   // Array of rows
export type LayoutGrid = LayerGrid[]; // All layers

// Bottom layer (8x15)
export const bottomLayer: LayerGrid = [
  [1,2,3,4,5,6,7,8,9,10,11,12],       // row 0 → 12 tiles
  [3,4,5,6,7,8,9,10],                 // row 1 → 8 tiles
  [2,3,4,5,6,7,8,9,10,11],            // row 2 → 10 tiles
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], // row 3 → 15 tiles (center row)
  [1,2,3,4,5,6,7,8,9,10,11,12],       // row 4 → 12 tiles
  [2,3,4,5,6,7,8,9,10,11],            // row 5 → 10 tiles
  [3,4,5,6,7,8,9,10],                 // row 6 → 8 tiles
  [1,2,3,4,5,6,7,8,9,10,11,12],       // row 7 → 12 tiles
];

// Floating tiles outside main grid
const floatingTiles = [
  { row: 4, col: 1 },   // left
  { row: 4, col: 14 },  // right
  { row: 0, col: 14 },  // top
];

// Utility to get center subset of a row
function centerRow(row: number[], targetWidth: number): number[] {
  const start = Math.floor((row.length - targetWidth) / 2);
  return row.slice(start, start + targetWidth);
}

// Generate a layer by shrinking each row
function generateLayer(previousLayer: LayerGrid, rowWidths: number[]): LayerGrid {
  return rowWidths.map((width, i) => centerRow(previousLayer[i], width));
}

// Define row widths for each layer
const layer6x6Widths = [6,6,6,6,6,6];   // 6x6 layer (6 tiles in each row)
const layer4x4Widths = [4,4,4,4];       // 4x4 layer
const layer2x2Widths = [2,2];           // 2x2 layer
const layer1Width = [1];                // single tile

// Generate all layers
const layer1 = generateLayer(bottomLayer.slice(1,7), layer6x6Widths); // pick rows 1-6
const layer2 = generateLayer(layer1.slice(1,5), layer4x4Widths);      // pick middle rows
const layer3 = generateLayer(layer2.slice(1,3), layer2x2Widths);      // pick middle rows
const layer4 = generateLayer(layer3.slice(0,1), layer1Width);         // single center tile

// NEW: Return full layout as a grid (array of layers with rows of column indices)
export const turtleLayout = (): LayoutGrid => {
  return [bottomLayer, layer1, layer2, layer3, layer4];
};
