// Import necessary functions and types
import type { TileDesignProps, TileSymbol } from "../types/TileProps"; // Import our custom type definitions
import { useMemo } from "react"; // React hook for memoization (performance optimization)
import { useMahjonggTileDesign } from "../hooks/useMahjonggTileDesign";

const TileDesign = ({
  name,
  className,
  onClick,
  isSelected,
}: TileDesignProps) => {
  // "Take the object returned by useMahjonggTileDesign(), look for a property on it called getTileDesign, and create a new variable with that same name containing its value."
  const { getTileDesign } = useMahjonggTileDesign();

  const SymbolComponent = getTileDesign(name);

  // Safety check
  if (!SymbolComponent) {
    return null;
  }

  return <SymbolComponent className={className} onClick={onClick} />;
};

export default TileDesign;
