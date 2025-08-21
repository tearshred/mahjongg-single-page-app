// Defining the props that the Tile component will accept from its parent
// For TileDesign
export type TileDesignProps = {
  name?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
};

// For Tile
export type TileProps = {
  generatedTile?: string;
  onClick?: (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
}