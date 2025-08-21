import { loadTiles, loadSharedTiles } from "../utils/tileLoader";
import type { TileDesignProps } from "../types/TileProps";

const TileDesign = ({ name, className, onClick }: TileDesignProps) => {

  const sharedTiles = loadSharedTiles();
    //console.log("Shared tiles keys:", Object.keys(sharedTiles));
// Debug: trace which keys are being compared
Object.keys(sharedTiles).forEach(key => {
  console.log("Comparing:", key, "endsWith", `${name}.svg`, key.endsWith(`${name}.svg`));
});

  // Grab Front.svg dynamically
  const tileBaseKey = Object.keys(sharedTiles).find(key => key.endsWith(`${name}.svg`));
  console.log("Tile key found:", tileBaseKey);
  const TileBase = tileBaseKey ? sharedTiles[tileBaseKey] : null;
  console.log("TileBase component:", TileBase);
  console.log(name);


  return (
    <div data-testid="tile-base">
      {TileBase && <TileBase className="h-30 w-auto cursor-pointer"/>}
    </div>
  );
};

export default TileDesign;
 