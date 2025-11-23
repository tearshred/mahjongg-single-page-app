import { extractTilePositions } from "./grid-system";
import type { LayoutPosition } from "../../types/BoardLayouts";
import type { Grid3D } from "../../types/game-logic";
import { turtleLayout } from "../layouts/turtle-layout";

/**
 * Generate tile positions from a 3D grid layout
 * @param grid3D - The 3D grid containing tile placement data
 * @returns Array of layout positions for all tiles
 */
export function generateLayout(grid3D: Grid3D): LayoutPosition[] {
  return extractTilePositions(grid3D);
}

/**
 * Convenience helper: generate positions specifically for the turtle layout
 */
export function generateTurtleLayout(): LayoutPosition[] {
  const grid = turtleLayout();
  return generateLayout(grid);
}


