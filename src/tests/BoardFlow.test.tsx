import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Board from "../components/Board";
import TileDesign from "../components/TileDesign";
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";

describe("<Board /> full data flow", () => {
  it("traces tile names from Board → Tile → TileDesign", () => {
    // Render the entire board
    render(<Board />);

    // Grab all TileDesign components rendered
    const tileBaseDivs = screen.getAllByTestId("tile-base");
    console.log("Number of TileDesign components rendered:", tileBaseDivs.length);

    // Log each TileDesign's content
    tileBaseDivs.forEach((div, index) => {
      console.log(`TileDesign #${index}:`, div.innerHTML);
    });

    // Check that at least one tile is rendered
    expect(tileBaseDivs.length).toBeGreaterThan(0);

    // Additionally, log the tile names from the hook
    function HookTester() {
      const tiles = useMahjonggTileData();
      console.log("Tile names from useMahjonggTileData hook:", tiles.map(t => t.name));
      return null;
    }

    render(<HookTester />);
  });
});
