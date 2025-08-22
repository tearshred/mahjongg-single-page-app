import type { FC, SVGProps } from "react";

// SVG Component Types
// This creates a type for an object where:
// keys are file paths and values are React components representing those SVGs.
// This is used to define the structure of the tile symbols loaded from SVG files.
// It allows us to easily reference and use SVGs as React components in our application.
export type SVGComponent = FC<SVGProps<SVGSVGElement>>;
export type SymbolModules = Record<string, SVGComponent>;

// Base tile structure (used by the hook and internal logic)
export interface TileSymbol {
  name: string; // e.g., "Bamboo1", "Pin2"
  path: string; // Full path to SVG file
  Component: SVGComponent; // Using our SVGComponent type
}

// Structure returned by the tile loader
export interface TileSymbols {
  // Gives us two ways to access tiles:
  // byPath: When we need to quickly find a specific tile
  // asArray: When we need to map/filter/find tiles
  // Makes the loader's output predictable and type-safe
  byPath: SymbolModules; // Quick lookup object
  asArray: TileSymbol[]; // Easy iteration format
}

// Props for the main Tile component
export interface TileProps {
  name: string; // Changed from generatedTile for consistency
  isSelected?: boolean; // For highlighting selected tiles
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
}

// Props passed to the visual part
export interface TileDesignProps {
  name: string;
  className?: string;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
}
