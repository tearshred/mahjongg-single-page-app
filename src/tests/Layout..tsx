import { describe, it, expect } from "vitest";
import { generateTurtleLayout } from "../gameplay-features/game-logic/layout-builder";

describe("generateTurtleLayout", () => {
  // Test 1 - Checking if there is an array
  it("generates an array of tile positions", () => {
    const layoutArray = generateTurtleLayout();
    expect(Array.isArray(layoutArray)).toBe(true);
    //console.log("Array length: " + layoutArray.length);
    //console.table(layoutArray);
  });
  // Test 2 - Ensuring each position object has the correct keys (layer, row, col) and that their types are numbers
  it("ensures each position has valid keys and number types", () => {
    const tilePositions = generateTurtleLayout();
    tilePositions.forEach((element) => {
      expect(element).toHaveProperty("layer");
      expect(element).toHaveProperty("row");
      expect(element).toHaveProperty("col");
      expect(typeof element.layer).toBe("number");
      expect(typeof element.row).toBe("number");
      expect(typeof element.col).toBe("number");
    });
  });
  // Test 3 - Visually verifying layout by displaying tiles in matrix, showing which positions are occupied and which are empty
  it("displays the board layout as a matrix with occupied and empty positions", () => {
    const tilePositions = generateTurtleLayout();

    // Determine max row/col per layer
    const layerDimensions: Record<number, { maxRow: number; maxCol: number }> = {};
    tilePositions.forEach(({ layer, row, col }) => {
      if (!layerDimensions[layer]) {
        layerDimensions[layer] = { maxRow: 0, maxCol: 0 };
      }
      layerDimensions[layer].maxRow = Math.max(layerDimensions[layer].maxRow, row);
      layerDimensions[layer].maxCol = Math.max(layerDimensions[layer].maxCol, col);
    });

    // Build matrix per layer
    const layerMatrices: Record<number, string[][]> = {};
    tilePositions.forEach(({ layer, row, col }) => {
      const { maxRow, maxCol } = layerDimensions[layer];
      if (!layerMatrices[layer]) {
        layerMatrices[layer] = Array.from({ length: maxRow + 1 }, () =>
          Array.from({ length: maxCol + 1 }, () => "x")
        );
      }
      layerMatrices[layer][row][col] = "o";
    });

    // Log each layer
    Object.entries(layerMatrices).forEach(([layer, matrix]) => {
      console.log("Layer", layer);
      console.table(matrix);
    });


  });
});
