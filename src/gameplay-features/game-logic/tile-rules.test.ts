import { describe, expect, it } from "vitest";
import type { GridPosition } from "../../types/BoardLayouts";
import type { TileDataWithState } from "../../types/tile-meta";
import { areTilesMatch, computeTileBlockers, hasSolvableMove, isTileFree } from "./tile-rules";

function createTile(overrides: Partial<TileDataWithState> & { position: GridPosition }): TileDataWithState {
  return {
    name: "Man1",
    path: "/mock/Man1.svg",
    Component: (() => null) as TileDataWithState["Component"],
    value: "Man1",
    isSelected: false,
    isClicked: false,
    isHighlighted: false,
    isPlayable: false,
    isMatchCandidate: false,
    isMatched: false,
    ...overrides,
    position: overrides.position,
  };
}

describe("tile-rules", () => {
  it("treats a tile as blocked when both horizontal sides are occupied", () => {
    const centerTile = createTile({ position: { layer: 0, row: 3, col: 4, gridRow: 4, gridColumn: 5 } });
    const leftTile = createTile({ position: { layer: 0, row: 3, col: 3, gridRow: 4, gridColumn: 4 } });
    const rightTile = createTile({ position: { layer: 0, row: 3, col: 5, gridRow: 4, gridColumn: 6 } });

    const blockers = computeTileBlockers(centerTile, [centerTile, leftTile, rightTile]);

    expect(blockers.isLeftBlocked).toBe(true);
    expect(blockers.isRightBlocked).toBe(true);
    expect(isTileFree(centerTile, [centerTile, leftTile, rightTile])).toBe(false);
  });

  it("allows a tile when one horizontal side is open", () => {
    const centerTile = createTile({ position: { layer: 0, row: 3, col: 4, gridRow: 4, gridColumn: 5 } });
    const leftTile = createTile({ position: { layer: 0, row: 3, col: 3, gridRow: 4, gridColumn: 4 } });

    const blockers = computeTileBlockers(centerTile, [centerTile, leftTile]);

    expect(blockers.isLeftBlocked).toBe(true);
    expect(blockers.isRightBlocked).toBe(false);
    expect(isTileFree(centerTile, [centerTile, leftTile])).toBe(true);
  });

  it("blocks a tile when a higher-layer tile overlaps it", () => {
    const centerTile = createTile({ position: { layer: 0, row: 3, col: 4, gridRow: 4, gridColumn: 5 } });
    const topTile = createTile({ position: { layer: 1, row: 3, col: 4, gridRow: 4, gridColumn: 5 } });

    const blockers = computeTileBlockers(centerTile, [centerTile, topTile]);

    expect(blockers.isTopBlocked).toBe(true);
    expect(isTileFree(centerTile, [centerTile, topTile])).toBe(false);
  });

  it("treats Dora variants as matching their base tile", () => {
    const baseTile = createTile({ name: "Pin5", value: "Pin5", position: { layer: 0, row: 2, col: 2, gridRow: 3, gridColumn: 3 } });
    const doraTile = createTile({ name: "Pin5-Dora", value: "Pin5-Dora", position: { layer: 0, row: 2, col: 4, gridRow: 3, gridColumn: 5 } });

    expect(areTilesMatch(baseTile, doraTile)).toBe(true);
  });

  describe("hasSolvableMove", () => {
    it("returns true when two free matching tiles exist", () => {
      const tileA = createTile({ name: "Sou1", value: "Sou1", position: { layer: 0, row: 0, col: 0, gridRow: 1, gridColumn: 1 } });
      const tileB = createTile({ name: "Sou1", value: "Sou1", position: { layer: 0, row: 0, col: 2, gridRow: 1, gridColumn: 3 } });

      expect(hasSolvableMove([tileA, tileB])).toBe(true);
    });

    it("returns false when the only matching pair is blocked", () => {
      // Center is blocked left and right by neighbors; its match is on the far side but also blocked
      const left  = createTile({ name: "Pin3", value: "Pin3", position: { layer: 0, row: 3, col: 3, gridRow: 4, gridColumn: 4 } });
      const center = createTile({ name: "Pin3", value: "Pin3", position: { layer: 0, row: 3, col: 4, gridRow: 4, gridColumn: 5 } });
      const right  = createTile({ name: "Pin3", value: "Pin3", position: { layer: 0, row: 3, col: 5, gridRow: 4, gridColumn: 6 } });
      // left is blocked on its right by center; right is blocked on its left by center;
      // center is blocked on both sides — so no free pair of Pin3 exists.

      expect(hasSolvableMove([left, center, right])).toBe(false);
    });

    it("returns false when there are no tiles left", () => {
      expect(hasSolvableMove([])).toBe(false);
    });

    it("ignores matched tiles when checking for moves", () => {
      const matched = createTile({ name: "Sou1", value: "Sou1", isMatched: true, position: { layer: 0, row: 0, col: 0, gridRow: 1, gridColumn: 1 } });
      const active  = createTile({ name: "Sou1", value: "Sou1", position: { layer: 0, row: 0, col: 2, gridRow: 1, gridColumn: 3 } });

      // Only one unmatched Sou1 tile — no valid pair
      expect(hasSolvableMove([matched, active])).toBe(false);
    });
  });
});