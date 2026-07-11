import { describe, expect, it } from "vitest";
import {
  getTilePlacement,
  TILE_HEIGHT,
  TILE_HORIZONTAL_STEP,
  TILE_VERTICAL_STEP,
  TILE_WIDTH,
} from "./tilePlacement";

describe("tilePlacement", () => {
  it("uses a full tile stride for adjacent tiles on the same layer", () => {
    const firstTile = getTilePlacement({ layer: 0, row: 0, col: 0 });
    const nextColumnTile = getTilePlacement({ layer: 0, row: 0, col: 1 });
    const nextRowTile = getTilePlacement({ layer: 0, row: 1, col: 0 });

    expect(TILE_HORIZONTAL_STEP).toBe(TILE_WIDTH);
    expect(TILE_VERTICAL_STEP).toBe(TILE_HEIGHT);
    expect(nextColumnTile.left - firstTile.left).toBe(TILE_WIDTH);
    expect(nextRowTile.top - firstTile.top).toBe(TILE_HEIGHT);
  });

  it("keeps fractional offsets available for half-tile placement", () => {
    const baseTile = getTilePlacement({ layer: 0, row: 2, col: 3 });
    const offsetTile = getTilePlacement({ layer: 0, row: 2, col: 3, offsetX: 0.5, offsetY: 0.5 });

    expect(offsetTile.left - baseTile.left).toBe(TILE_WIDTH / 2);
    expect(offsetTile.top - baseTile.top).toBe(TILE_HEIGHT / 2);
  });
});