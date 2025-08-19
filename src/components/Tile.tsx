import TileDesign from "./TileDesign";
import type { TileProps } from "../types/TileProps";

const Tile = ({ onClick, generatedTile }: TileProps) => {
  // Creating a wrapper function that stops the propagation first
  const handleClick = (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
    e.stopPropagation(); // prevent the click from reaching the parent
    if (onClick) onClick(e); // call the parent’s onClick handler
  };

  return (
    <div className="relative inline-block">
      <TileDesign 
        name={generatedTile}
        onClick={handleClick}
      />
    </div>
  );
};

export default Tile;
