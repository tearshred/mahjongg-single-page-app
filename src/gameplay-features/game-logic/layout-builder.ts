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
    // Keep the actual column numbers from the input row instead of normalizing them
    const centeredRow = centerRow(previousLayer[i], width);
    return centeredRow;  // Preserve the original column numbers
  });
}

/**
 * Flatten a LayerGrid to an array of LayoutPosition
 */
function flattenLayer(layer: LayerGrid, layerIndex: number): LayoutPosition[] {
  const positions: LayoutPosition[] = [];
  
  layer.forEach((row, rowIndex) => {
    row.forEach((colValue) => {
      positions.push({ 
        layer: layerIndex, 
        row: rowIndex, 
        col: colValue,
        floating: false
      });
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

  // Layer 1 = 6x6
  const layer1 = generateLayer(bottomLayer.slice(1, 7), [6, 6, 6, 6, 6, 6]);
  positions.push(...flattenLayer(layer1, 1));

  // Layer 2 = 4x4
  const layer2 = generateLayer(layer1.slice(1, 5), [4, 4, 4, 4]);
  positions.push(...flattenLayer(layer2, 2));

  // Layer 3 = 2x2
  //console.log('Generating Layer 3 (2x2)');
  const layer3 = generateLayer(layer2.slice(1, 3), [2, 2]);
  positions.push(...flattenLayer(layer3, 3));

  //// Layer 4 = 1x1
  //console.log('Generating Layer 4 (1x1)');
  const layer4 = generateLayer(layer3.slice(0, 1), [1]);
  positions.push(...flattenLayer(layer4, 4));

  // Final layout statistics
  console.log('Final layout statistics:', {
    totalTiles: positions.length,
    byLayer: positions.reduce((acc, pos) => {
      acc[pos.layer] = (acc[pos.layer] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    dimensions: {
      maxRow: Math.max(...positions.map(p => p.row)),
      maxCol: Math.max(...positions.map(p => p.col)),
      layers: Math.max(...positions.map(p => p.layer)) + 1
    }
  });

  return positions;
}
