import TileBase from "../assets/tiles/Front.svg?react";

// Defining the props that the Tile component will accept from its parent
type TileProps = {
  //   value: string;
  generatedTile?: string;
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
};

const Tile = ({ onClick, generatedTile }: TileProps) => {
  // Creating a wrapper function that stops the propagation first
  const handleClick = (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
    e.stopPropagation(); // prevent the click from reaching the parent
    if (onClick) onClick(e); // call the parent’s onClick handler
  };

  return (
    <div className="relative inline-block">
      
      <TileBase onClick={handleClick} className="h-30 w-auto cursor-pointer" />
      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-black">
        {generatedTile}
      </span>
    </div>
  );
};

export default Tile;
