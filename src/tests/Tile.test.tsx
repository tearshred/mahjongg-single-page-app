import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TileDesign from "../components/TileDesign";

describe("<TileDesign /> - Baby Step 1: TileBase", () => {
  it("renders the TileBase component from shared tiles", () => {
    // Render TileDesign with a dummy tile name
    render(<TileDesign />);
    expect(screen.getByTestId("tile-base")).toBeInTheDocument();
    console.log("TileBase (Front.svg) test working/rednered succesfully");
  });
});