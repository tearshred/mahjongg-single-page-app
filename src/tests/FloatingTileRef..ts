import { describe, it, expect } from "vitest";
import { turtleLayout } from "../gameplay-features/layouts/turtle-layout";
import type { TileDataWithState, TileSize } from "../types/TileState";

describe("Floating tiles", () => {
  it("marks the correct tiles as floating in layer 0", () => {
    const layout = turtleLayout();
    const bottomLayer = layout.layers[0];

    // Tiles we expect to be floating
    const floatingPositions = [
      { row: 3, col: 0 },
      { row: 3, col: 13 },
      { row: 3, col: 14 },
    ];

    // Flatten the grid into TileDataWithState objects
    const boardTiles: TileDataWithState[] = bottomLayer.flatMap((row, r) =>
      row.map((col) => ({
        name: `tile-${r}-${col}`,
        isSelected: false,
        isClicked: false,
        isHighlighted: false,
        floating: floatingPositions.some(fp => fp.row === r && fp.col === col),
        value: `${r}-${col}`,
        position: { row: r, col, gridRow: r + 1, gridColumn: col + 1, layer: 0 },
      }))
    );

    // Check floating tiles
    floatingPositions.forEach(fp => {
      const tile = boardTiles.find(t => t.position.row === fp.row && t.position.col === fp.col);
      expect(tile).toBeDefined();
      expect(tile!.floating).toBe(true);
    });

    // Optional: verify non-floating tiles
    const nonFloating = boardTiles.filter(t => !floatingPositions.some(fp => fp.row === t.position.row && fp.col === t.position.col));
    nonFloating.forEach(t => expect(t.floating).toBe(false));
  });
});