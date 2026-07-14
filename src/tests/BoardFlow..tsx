import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { loadTileSymbols } from "../utils/tileSymbolLoader";
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";
import type { TileSymbol, TileSymbols } from "../types/tile-meta";
import Board from "../components/Board";

describe("Tile Loading Flow", () => {
  // Test 1: Direct loader test
  it("loadTileSymbols should load SVG files", () => {
    const symbols: TileSymbols = loadTileSymbols();
    
    console.log("Direct loader test:", {
      byPathKeys: Object.keys(symbols.byPath),
      arrayLength: symbols.asArray.length,
      firstTile: symbols.asArray[0]
    });

    expect(symbols.asArray.length).toBeGreaterThan(0);
    expect(Object.keys(symbols.byPath).length).toBeGreaterThan(0);
  });

  // Test 2: Hook test
  it("useMahjonggTileData should return processed tiles", () => {
    let hookTiles: TileSymbol[] = [];

    function TestHook() {
      hookTiles = useMahjonggTileData();
      return null;
    }

    render(<TestHook />);

    console.log("Hook test results:", {
      tilesCount: hookTiles.length,
      tileNames: hookTiles.map(t => t.name),
      firstTile: hookTiles[0]
    });

    expect(hookTiles.length).toBeGreaterThan(0);
    hookTiles.forEach(tile => {
      expect(tile).toHaveProperty('name');
      expect(tile).toHaveProperty('path');
      expect(tile).toHaveProperty('Component');
    });
  });

  // Test 3: Full component chain
  it("Board should render tiles with correct data-testid", () => {
    render(<Board onNewGame={() => {}} />);
    
    // Check for both base tiles and symbols
    const tileSymbols = screen.getAllByTestId("tile-symbol");
    const tileBases = screen.getAllByTestId("tile-base");

    console.log("Component render test:", {
      symbolsCount: tileSymbols.length,
      basesCount: tileBases.length
    });

    // Log the actual HTML for inspection
    console.log("First tile HTML:", {
      symbol: tileSymbols[0]?.outerHTML,
      base: tileBases[0]?.outerHTML
    });

    expect(tileSymbols.length).toBeGreaterThan(0);
    expect(tileBases.length).toBeGreaterThan(0);
  });
});