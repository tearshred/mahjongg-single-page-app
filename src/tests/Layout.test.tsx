import { describe, it, expect } from "vitest";
import { generateTurtleLayout } from "../gameplay-features/game-logic/layout-builder";

// Mock TURTLE_SHAPE for testing
const MOCK_TURTLE_SHAPE = {
  baseRows: 10,
  baseCols: 10,
  maxLayers: 3,
};

describe("generateTurtleLayout", () => {
  // Test 1 - Checking if there is an array
  it("generates an array of tile positions", () => {
    const layoutArray = generateTurtleLayout(MOCK_TURTLE_SHAPE);
    expect(Array.isArray(layoutArray)).toBe(true);
    //console.log("Array length: " + layoutArray.length);
    //console.table(layoutArray);
  });
  // Test 2 - Ensuring each position object has the correct keys (layer, row, col) and that their types are numbers
  it("ensures each position has valid keys and number types", () => {
    const tilePositions = generateTurtleLayout(MOCK_TURTLE_SHAPE);
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
    const tileDisplayMatrix = generateTurtleLayout(MOCK_TURTLE_SHAPE);

    // Find maximum row and column for matrix dimensions
    let maxRow = 0;
    let maxCol = 0;
    tileDisplayMatrix.forEach((tile) => {
      if (tile.row > maxRow) maxRow = tile.row;
      if (tile.col > maxCol) maxCol = tile.col;
    });

    // Create a separate matrix for each layer
    const layerMatrices: Record<number, string[][]> = {};

    tileDisplayMatrix.forEach((tile, index) => {
      if (!layerMatrices[tile.layer]) {
        layerMatrices[tile.layer] = Array.from({ length: maxRow + 1 }, () =>
          Array.from({ length: maxCol + 1 }, () => "x")
        );
      }

      // place tile index (as string) in its position
      layerMatrices[tile.layer][tile.row][tile.col] = index.toString();
    });

    Object.entries(layerMatrices).forEach(([layer, matrix]) => {
      console.log("Layer", layer);
      console.table(matrix);
    });


  });
});
