import { useMemo } from "react";
import type {
  LayoutName,
  LayoutConfig,
} from "../types/game-logic/LayoutRegistry";
import {
  DEFAULT_LAYOUT,
  LAYOUT_GENERATORS,
  LAYOUT_METADATA,
} from "../types/game-logic/LayoutRegistry";
import { generateLayout } from "../gameplay-features/game-logic/layout-builder";

/**
 * Hook that provides layout configuration for the Mahjongg board
 * @param layoutName - Which layout to use (defaults to turtle)
 * @returns LayoutConfig with dimensions, positions, and render settings
 */
export function useLayoutConfig(
  layoutName: LayoutName = DEFAULT_LAYOUT
): LayoutConfig {

  // Memoizing everything so it doesn't recalculate on every re-render. 
  const positions = useMemo(() => {
    // Gets the function that creates the 3D grid (turtleLayout for "turtle")
    const generator = LAYOUT_GENERATORS[layoutName];
    // Calls turtleLayout() which returns a Grid3D (5 layers of 8×15 tile data)
    const grid3D = generator();
    // Convert 3D grid to positions
    return generateLayout(grid3D);
  }, [layoutName]); // Only recalculate when layoutName changes

  // Gets layout-specific data: {gridDimensions: {rows:8, columns:15}, layerCount:5, renderConfig:...}
  const metadata = LAYOUT_METADATA[layoutName];

  return {
    ...metadata, // Spread dimensions, layer count, renderConfig
    positions,
  };
}
