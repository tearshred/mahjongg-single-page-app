import { bottomLayer } from "../layouts/turtle-layout";
import type { LayoutGrid, LayerRow, LayerGrid } from "../layouts/turtle-layout";
import type { LayoutPosition } from "../../types/BoardLayouts";

/**
 * Utility: Get center subset of a row
 * Ensures that only `targetWidth` tiles are included
 */
function centerRow(row: number[], targetWidth: number): number[] {
  const start = Math.floor((row.length - targetWidth) / 2);
  return row.slice(start, start + targetWidth);
}

/**
 * Utility: Generate a new layer by shrinking rows
 * Returns a LayerGrid where each row has exactly `rowWidths[i]` tiles
 * Column indices start at 0 for the new layer
 */
function generateLayer(previousLayer: LayerGrid, rowWidths: number[]): LayerGrid {
  return rowWidths.map((width, i) => {
    const centeredRow = centerRow(previousLayer[i], width);
    // Normalize column indices to start from 0
    return centeredRow.map((_, colIndex) => colIndex);
  });
}

/**
 * Flatten a LayerGrid to an array of LayoutPosition
 */
function flattenLayer(layer: LayerGrid, layerIndex: number): LayoutPosition[] {
  const positions: LayoutPosition[] = [];
  layer.forEach((row, rowIndex) => {
    row.forEach((col) => {
      positions.push({ layer: layerIndex, row: rowIndex, col });
    });
  });
  return positions;
}

/**
 * Generate the full Turtle layout
 */
export function generateTurtleLayout(): LayoutPosition[] {
  const positions: LayoutPosition[] = [];

  // Layer 0 = bottom layer
  positions.push(...flattenLayer(bottomLayer, 0));

  // Layer 1 = 6x6 (pick middle 6 rows)
  const layer1 = generateLayer(bottomLayer.slice(1, 7), [6, 6, 6, 6, 6, 6]);
  positions.push(...flattenLayer(layer1, 1));

  // Layer 2 = 4x4 (pick middle 4 rows of layer1)
  const layer2 = generateLayer(layer1.slice(1, 5), [4, 4, 4, 4]);
  positions.push(...flattenLayer(layer2, 2));

  // Layer 3 = 2x2 (pick middle 2 rows of layer2)
  const layer3 = generateLayer(layer2.slice(1, 3), [2, 2]);
  positions.push(...flattenLayer(layer3, 3));

  // Layer 4 = 1x1 (single tile from layer3)
  const layer4 = generateLayer(layer3.slice(0, 1), [1]);
  positions.push(...flattenLayer(layer4, 4));

  return positions;
}