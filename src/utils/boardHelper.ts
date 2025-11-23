import type { TileDataWithState } from "../types/tile-meta";
import type { LayoutPosition } from "../types/BoardLayouts";

/** Filter tiles by layer */
export function filterLayer(
  tiles: TileDataWithState[],
  layer: number
): TileDataWithState[] {
  // Only keep tiles where their position.layer matches the target layer
  return tiles.filter((t) => t.position.layer === layer);
}

/** Compute grid size for CSS Grid from tile positions */
export function computeGridSize(tiles: TileDataWithState[]) {
  // Extract positions to compute max rows/columns
  const positions: LayoutPosition[] = tiles.map((t) => t.position);

  const maxCol = Math.max(...positions.map((p) => p.col)) + 1;
  const maxRow = Math.max(...positions.map((p) => p.row)) + 1;

  return { maxCol, maxRow };
}
