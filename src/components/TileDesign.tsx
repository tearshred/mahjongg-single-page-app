// Import necessary functions and types
import type { TileDesignProps } from "../types/tile-meta"; // Import our custom type definitions
import { useMahjonggTileDesign } from "../hooks/useMahjonggTileDesign";

const TileDesign = ({
  name,
  className,
  onClick,
}: TileDesignProps) => {
  // "Take the object returned by useMahj property on it called getTileDesign, and create a new variable with that same namonggTileDesign(), look for ae containing its value."
  const { getTileDesign } = useMahjonggTileDesign();

  const SymbolComponent = getTileDesign(name);

  // Safety check
  if (!SymbolComponent) {
    return null;
  }

  return <SymbolComponent className={className} onClick={onClick} />;
};

export default TileDesign;
