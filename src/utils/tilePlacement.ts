import type { GridPosition } from "../types/BoardLayouts";

export const TILE_WIDTH = 60;
export const TILE_HEIGHT = 80;
export const TILE_HORIZONTAL_STEP = TILE_WIDTH;
export const TILE_VERTICAL_STEP = TILE_HEIGHT;
export const TILE_LAYER_OFFSET_X = 4;
export const TILE_LAYER_OFFSET_Y = 5;
export const TILE_LAYER_Z_INDEX = 10;

export interface TilePlacement {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  zIndex: number;
}

export function getTilePlacement(position: Pick<GridPosition, "row" | "col" | "layer" | "offsetX" | "offsetY">): TilePlacement {
  const left =
    position.col * TILE_HORIZONTAL_STEP -
    position.layer * TILE_LAYER_OFFSET_X +
    (position.offsetX ?? 0) * TILE_HORIZONTAL_STEP;
  const top =
    position.row * TILE_VERTICAL_STEP -
    position.layer * TILE_LAYER_OFFSET_Y +
    (position.offsetY ?? 0) * TILE_VERTICAL_STEP;

  return {
    left,
    top,
    right: left + TILE_WIDTH,
    bottom: top + TILE_HEIGHT,
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    zIndex: position.layer * 1000 + position.col * 100 + position.row * 10,
  };
}