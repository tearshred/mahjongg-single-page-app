import type { ReactNode } from "react";
import { TILE_HEIGHT, TILE_LAYER_OFFSET_X, TILE_LAYER_OFFSET_Y, TILE_WIDTH } from "../utils/tilePlacement";
import "../styles/tile.css";

interface MahjongTileProps {
  layer: number;
  row: number;
  column: number;
  isSelected?: boolean;
  isPlayable?: boolean;
  offsetX?: number;
  offsetY?: number;
  onSelect?: () => void;
  children?: ReactNode;
}

export const MahjongTile = ({
  layer,
  row,
  column,
  isSelected = false,
  isPlayable = true,
  offsetX = 0,
  offsetY = 0,
  onSelect,
  children,
}: MahjongTileProps) => {
  const zIndex = layer * 1000 + column * 100 + row * 10;
  const top    = row    * TILE_HEIGHT - layer * TILE_LAYER_OFFSET_Y + offsetY * TILE_HEIGHT;
  const left   = column * TILE_WIDTH  - layer * TILE_LAYER_OFFSET_X + offsetX * TILE_WIDTH;

  const className = [
    "mj-tile",
    isSelected  ? "mj-tile--selected" : "",
    !isPlayable ? "mj-tile--blocked"  : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={className}
      style={{ top, left, zIndex }}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
    >
      <div className="pointer-events-none flex h-[60px] w-[48px] items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default MahjongTile;
