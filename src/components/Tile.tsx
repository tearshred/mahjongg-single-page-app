import TileDesign from "./TileDesign";
import TileBase from "../assets/shared/TileBase.svg?react";
import type { TileProps, TileDesignProps } from "../types/TileProps";

const Tile = ({ onClick, name, isSelected }: TileProps) => {

  // Creating a wrapper function that stops the propagation first
  const handleClick = (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
    e.stopPropagation(); // prevent the click from reaching the parent
    if (onClick) onClick(e); // call the parent’s onClick handler
  };

  return (
    <div className={`relative inline-block ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <TileBase 
        onClick={handleClick}
        className="w-30 cursor-pointer top-0 left-0" 
      />
      <TileDesign 
        name={name}
        isSelected={isSelected}
        onClick={handleClick}
      />
    </div>
  );
};

export default Tile;
