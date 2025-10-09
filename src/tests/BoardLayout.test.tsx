import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useBoardLayout } from "../hooks/useBoardLayout";
import { HookTester, hookResult } from "./HookTesterComponent";
import type { LayoutPosition } from "../types/BoardLayouts";

describe("Layout generation test", () => {
  it("produces valid positions for the default turtle layout", () => {
    render(<HookTester hook={useBoardLayout} />);

    const positions = hookResult as LayoutPosition[];

    // Simple log of all positions
    // console.log("All positions:", positions);

    // Layered table view
    // In TypeScript, Record<K, V> is a utility type that describes an object where:
    // K = the type of the keys
    // V = the type of the values
    // In this case. keys are layer numbers [Separate tables for each layer]
    // Values are arrays of LayoutPositions
    // In summary, it creates an object where each layer number points to a list of tiles in that layer
    const layers: Record<number, LayoutPosition[]> = {};
    positions.forEach((tile) => {
      // If this layer does not exist yet in the object, create an empty array for it
      if (!layers[tile.layer]) layers[tile.layer] = [];
      // Add the current tile to the array for its layer
      layers[tile.layer].push(tile);
    });

    // Step 3: Loop through each layer in the object
    // Object.entries returns an array of [key, value] pairs for the object
    // layer is the layer number, tiles is the array of tiles in that layer
    Object.entries(layers).forEach(([layer, tiles]) => {
      // Log a header showing which layer and how many tiles it contains
      console.log(`Layer ${layer} (${tiles.length} tiles)`);
      // Create a simplified array with only row and col of each tile
      // and display it as a nice table in the console
      // *** Syntax explanation ***
      // { row: t.row, col: t.col } -
      // Creates a new object with two properties: row and col.
      // t.row is taken from the original tile object t.
      // t.col is also taken from t.
      console.table(tiles.map((t) => ({ row: t.row, col: t.col })));
    });

    expect(Array.isArray(positions)).toBe(true);
    expect(positions.length).toBeGreaterThan(0);

    positions.forEach((tile) => {
      expect(tile.layer).toBeDefined();
      expect(tile.row).toBeDefined();
      expect(tile.col).toBeDefined();
    });
  });
});
