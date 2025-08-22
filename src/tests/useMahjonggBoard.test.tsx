// Import testing utilities from Vitest and React Testing Library
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Import the hook we're testing and its type definition
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";
import type { Tile } from "../types/Tile";

describe("useMahjonggTileData", () => {
  // Main test case that verifies the hook's output structure
  it("should return an array of properly structured tile objects", () => {
    // Create a variable outside the component to capture hook's return value
    // We need this because we can't access hook results directly outside React
    let tiles: Tile[] = [];

    

    // Create a test component that only exists to run the hook
    // This is necessary because hooks can only be called inside React components
    function TestHook() {
      // Call the hook and store its result in our outer variable
      tiles = useMahjonggTileData();
      // Return null because this component doesn't need to render anything
      return null;
    }

    // Render our test component in a virtual DOM environment
    // This triggers the hook to run and populate our tiles array
    render(<TestHook />);

    // TEST GROUP 1: Basic Structure Tests
    // Verify that we got an array and it's not empty
    expect(Array.isArray(tiles)).toBe(true);
    expect(tiles.length).toBeGreaterThan(0);

    // TEST GROUP 2: Data Structure Tests
    // Check every tile object for correct properties and types
    tiles.forEach((tile) => {
      // Verify each tile has the required properties
      expect(tile).toHaveProperty('name');
      expect(tile).toHaveProperty('Component');
      
      // Verify the types of those properties
      expect(typeof tile.name).toBe('string');
      // React components are functions under the hood
      expect(typeof tile.Component).toBe('function');
    });

    // TEST GROUP 3: Debug Output
    // Log helpful information for debugging
    console.log('First tile structure:', {
      name: tiles[0].name,
      hasComponent: Boolean(tiles[0].Component)
    });
  });
});