import { describe, it, expect } from "vitest";
import { generateTurtleLayout } from "../gameplay-features/game-logic/layout-builder";

// Mock TURTLE_SHAPE for testing
const TURTLE_SHAPE = {
  baseRows: 6,
  baseCols: 6,
  maxLayers: 3,
};

// Override the global constant used in layout-builder for testing
// @ts-ignore
global.TURTLE_SHAPE = TURTLE_SHAPE;

describe("generateTurtleLayout", () => {
  it("returns an array of positions", () => {
    const positions = generateTurtleLayout();
    expect(Array.isArray(positions)).toBe(true);
    expect(positions.length).toBeGreaterThan(0);
  });

  it("positions have correct keys and types", () => {
    const positions = generateTurtleLayout();
    positions.forEach((pos) => {
      expect(pos).toHaveProperty("layer");
      expect(pos).toHaveProperty("row");
      expect(pos).toHaveProperty("col");
      expect(typeof pos.layer).toBe("number");
      expect(typeof pos.row).toBe("number");
      expect(typeof pos.col).toBe("number");
    });
  });

  it("layers shrink correctly", () => {
    const positions = generateTurtleLayout();

    // Check that layer 0 uses full baseRows/baseCols
    const layer0 = positions.filter((p) => p.layer === 0);
    expect(layer0.length).toBe(TURTLE_SHAPE.baseRows * TURTLE_SHAPE.baseCols);

    // Check that layer 1 uses smaller size
    const layer1 = positions.filter((p) => p.layer === 1);
    const expectedLayer1Rows = TURTLE_SHAPE.baseRows - 2 * 2; // shrinkage = 2 * layer
    const expectedLayer1Cols = TURTLE_SHAPE.baseCols - 2 * 2;
    expect(layer1.length).toBe(expectedLayer1Rows * expectedLayer1Cols);

    // Check that layer positions are offset correctly (row and col >= shrinkage)
    layer1.forEach((pos) => {
      expect(pos.row).toBeGreaterThanOrEqual(2); // shrinkage for layer 1
      expect(pos.col).toBeGreaterThanOrEqual(2);
    });
  });
});
