import type { TileDataWithState } from "../types/tile-meta";
import type { TileSymbol } from "../types/tile-meta";
import type { LayoutPosition } from "../types/BoardLayouts";
import { dealWinnableBoard } from "../gameplay-features/game-logic/shuffle";

export function assignRandomTiles(
  positions: LayoutPosition[],
  tileData: TileSymbol[]
): TileDataWithState[] {
  return dealWinnableBoard(positions, tileData);
}
