// Defining the props that the Tile component will accept from its parent
export type TileProps = {
  name?: string;
  className?: string;
  generatedTile?: string;
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
};