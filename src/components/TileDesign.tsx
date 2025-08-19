import { loadTiles, loadSharedTiles } from "../utils/tileLoader";
import type { TileProps } from "../types/TileProps";

const TileDesign = ({ name }: TileProps) => {

  const sharedTiles = loadSharedTiles();

  // Grab Front.svg dynamically
  const tileKey = Object.keys(sharedTiles).find(key => key.endsWith("Front.svg"));
  const TileBase = tileKey ? sharedTiles[tileKey].default : null;

  return (
    <div data-testid="tile-base">
      {TileBase && <TileBase className="h-30 w-auto cursor-pointer"/>}
    </div>
  );
};

export default TileDesign;
