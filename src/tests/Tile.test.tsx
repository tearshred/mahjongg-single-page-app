// src/tests/useMahjonggTileData.test.tsx
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import type { SVGComponent, TileSymbol } from "../types/TileProps";

// 1️⃣ Declare fake SVG first
const FakeSvg: SVGComponent = () => <svg data-testid="fake-svg" />;

// 2️⃣ Mock the loader using FakeSvg
vi.mock("../utils/tileSymbolLoader", () => ({
  loadTileSymbols: () => ({
    byPath: {
      "../assets/tiles/Man1.svg": FakeSvg,
      "../assets/tiles/Chun.svg": FakeSvg,
    },
    asArray: [
      { name: "Man1", path: "../assets/tiles/Man1.svg", Component: FakeSvg },
      { name: "Chun", path: "../assets/tiles/Chun.svg", Component: FakeSvg },
    ],
  }),
}));

// 3️⃣ Now import modules that use loadTileSymbols
import { render, screen } from "@testing-library/react";
import Tile from "../components/Tile";
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";

describe("Tile component", () => {
  it("renders Tile with mocked SVGs", () => {
    const { result } = renderHook(() => useMahjonggTileData());
    
    // Only the mocked tiles should appear
    expect(result.current).toHaveLength(2);
    expect(result.current[0].name).toBe("Man1");
    expect(result.current[1].name).toBe("Chun");
  });
});
