import TileBase from "../assets/tiles/Front.svg?react";

// Definint the props that the Tile component will accept from its parent
type TileProps = {
//   value: string;
  clickedTile?: string;
  onClick?: () => void;
};

const Tile = ({ onClick }: TileProps) => {
  return (
    <div>
      <TileBase
        onClick={onClick}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default Tile;
