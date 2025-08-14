import TileBase from "../assets/tiles/Front.svg?react";

// Definint the props that the Tile component will accept from its parent
type TileProps = {
  //   value: string;
  selectedTile?: string;
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
};

const Tile = ({ onClick }: TileProps) => {
  // Creating a wrapper function that stops the propagation first
  const handleClick = (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
    e.stopPropagation(); // prevent the click from reaching the parent
    if (onClick) onClick(e); // call the parent’s onClick handler
  };

  return (
    <TileBase onClick={handleClick} className="w-32 h-40 cursor-pointer" />
  );
};

export default Tile;
