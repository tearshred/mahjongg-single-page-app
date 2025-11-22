import { turtleLayout } from "../layouts/turtle-layout";
import { extractTilePositions } from "./grid-system";
import type { LayoutPosition } from "../../types/BoardLayouts";

/**
 * Generate the full Turtle layout using the new grid system
 */
export function generateTurtleLayout(): LayoutPosition[] {
  // Step 1: Get the full 3D grid (5 layers of 8x15 grids)
  const grid3D = turtleLayout();
  
  // Step 2: Extract positions where tiles exist
  // This scans the grid and creates LayoutPosition objects for each 'tile' or 'floating' cell
  const positions = extractTilePositions(grid3D);
  
  // Step 3: Log statistics for debugging
  // console.log('Final layout statistics:', {
  //   totalTiles: positions.length,
  //   byLayer: positions.reduce((acc, pos) => {
  //     acc[pos.layer] = (acc[pos.layer] || 0) + 1;
  //     return acc;
  //   }, {} as Record<number, number>),
  //   dimensions: {
  //     maxRow: Math.max(...positions.map(p => p.row)),
  //     maxCol: Math.max(...positions.map(p => p.col)),
  //     layers: Math.max(...positions.map(p => p.layer)) + 1
  //   }
  // });
  
  return positions;
}
