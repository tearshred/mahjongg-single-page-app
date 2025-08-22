// Import necessary functions and types
import { loadTileSymbols } from "../utils/tileSymbolLoader"; // Loads SVG files as React components
import type { TileDesignProps, TileSymbol } from "../types/TileProps"; // Import our custom type definitions
import { useMemo } from "react"; // React hook for memoization (performance optimization)

// TileDesign component definition with destructured props
// name: the identifier for the tile (e.g., "Man1", "Pin2")
// className: optional CSS classes
// onClick: click handler function
// isSelected: boolean for highlighting selected tiles
const TileDesign = ({ name, className, onClick, isSelected }: TileDesignProps) => {
  // useMemo prevents reloading tiles on every render
  // Only loads tiles once when component mounts
  // [] empty dependency array means this only runs once
  const tileSymbols = useMemo(() => loadTileSymbols(), []);

  // Find the specific tile component we want to render
  // tileSymbols.asArray: array of tile objects from our loader
  // find(): searches array for first matching item
  // (t: TileSymbol): explicitly type the parameter to satisfy TypeScript
  // t.name === name: matches the tile name with our prop name
  const tile = tileSymbols.asArray.find((t: TileSymbol) => t.name === name);

  return (
    // Container div for the tile symbol
    // data-testid: identifier for testing
    // className: conditional styling - z-10 brings selected tile to front
    <div data-testid="tile-symbol" className={`${isSelected ? 'z-10' : ''}`}>
      {/* Only render if we found a matching tile component */}
      {tile?.Component && (
        // Render the SVG component
        // tile.Component: the actual SVG React component
        // className: combines fixed styles with optional passed classes
        // - h-30: height
        // - w-auto: automatic width
        // - cursor-pointer: hand cursor on hover
        // - ${className || ''}: any additional classes or empty string if none
        <tile.Component 
          className={`h-30 w-auto cursor-pointer ${className || ''}`}
          onClick={onClick} // Pass through the click handler
        />
      )}
    </div>
  );
};

export default TileDesign;