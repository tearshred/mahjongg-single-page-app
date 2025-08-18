// Import Vitest utilities
// describe → groups related tests.
// it (or test) → defines a single test case.
// expect → makes assertions about your code’s behavior.
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Import custom type
import type { TileName } from "../types/Tile";

// Import functions or hooks to test
import {
  useMahjonggTileData,
  generateTileData,
} from "../hooks/useMahjonggTileData";

// Group all tests for this hook
describe("generateTileData", () => {
  // First test case: generate board and inspect
  it("should create a board array from tileData", () => {
    // Preparing a variable to hold an array of generated data
    let board: TileName[] = [];

    // Declaring a test function
    function MahjonggBoardTest() {
        const tileCache = useMahjonggTileData();
        board = generateTileData(tileCache)
        return null
    }

    // `render` mounts this React component into a fake DOM in order to interact with it and make assertions, for testing purposes
    // The hook `useMahjonggTileData` can only be called inside a comopnent, hence where render comes in. React "Rule of Hooks"
    // Without render(), React wouldn't call a hook at all, so `tileCache` would never be created
    // Summary - render() isn’t for the UI, it’s just to execute the hook safely inside React’s lifecycle
    render(<MahjonggBoardTest /> )

    console.table(board)
    expect(board).toBeDefined()
    expect(board.length).toBeGreaterThan(0);
  });
});
