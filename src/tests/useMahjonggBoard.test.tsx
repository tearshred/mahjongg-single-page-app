// Import Vitest utilities
//describe → groups related tests.
//it (or test) → defines a single test case.
//expect → makes assertions about your code’s behavior.
import React from "React";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tile } from "../types/Tile";

//Import functions or hooks to test
import {
  useMahjonggTileData,
  generateTileData,
} from "../hooks/useMahjonggTileData";

// Group all tests for this hook
describe("generateTileData", () => {
  // First test case: generate board and inspect
  it("should create a board array from tileData", () => {
    // Preparing a variable to hold an array of generated data
    let board: Tile[] = [];

    // Declaring a test function
    function MahjonggBoardTest() {
        const tileCache = useMahjonggTileData();
        board = generateTileData(tileCache)
        return null
    }

    render(<MahjonggBoardTest /> )

    console.table(board)
    expect(board).toBeDefined()
    expect(board.length).toBeGreaterThan(0);
  });
});
