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

  // Bug fix 3: Prevent empty tiles - always render a valid symbol or fallback
  if (!SymbolComponent || !name || name.trim() === "") {
    console.warn(`Invalid tile symbol: "${name}" - rendering fallback`);
    return (
      <div
        className={`${className} flex items-center justify-center bg-red-100 text-red-600 text-xs font-bold border-2 border-red-400`}
        onClick={onClick}
      >
        ?
      </div>
    );
  }

  return <SymbolComponent className={className} onClick={onClick} />;
};

export default TileDesign;
