import { turtleLayout } from "../layouts/turtle-layout";
import type { LayoutShape } from "../layouts/turtle-layout";
import type { LayoutPosition } from "../../types/BoardLayouts";
import { DEFAULT_TURTLE_SHAPE } from "../../types/BoardLayouts";

export function generateTurtleLayout(
  // Use provided shape or default board dimensions
  boardShape: typeof DEFAULT_TURTLE_SHAPE = DEFAULT_TURTLE_SHAPE,
  // How much each layer shrinks inward compared to the layer below
  shrinkPerLayer: number = 2
): LayoutPosition[] {
  // this variable is an array of LayoutPosition objects
  // ` = [] ` - start it as an empty array
  const positions: LayoutPosition[] = [];

  // Use imported turtle layout instead of hardcoded array
  const layers: LayoutShape = turtleLayout();

  layers.forEach((layerRows, layerIndex) => {
    let rowOffset = 0; // Tracks current row in matrix

    layerRows.forEach((rowLength) => {
      // Center row relative to Layer 0 width
      const colStart = Math.max(0, Math.floor((layers[0][0] - rowLength) / 2));

      for (let col = 0; col < rowLength; col++) {
        positions.push({
          layer: layerIndex,
          row: rowOffset,
          col: colStart + col,
        });
      }

      rowOffset++;
    });
  });

  return positions;
}
