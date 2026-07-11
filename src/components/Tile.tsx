import type { ReactNode } from "react";
import { TILE_HEIGHT, TILE_LAYER_OFFSET_X, TILE_LAYER_OFFSET_Y, TILE_WIDTH } from "../utils/tilePlacement";

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

const SVG_WIDTH = 74;
const SVG_HEIGHT = 98;

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
  const zIndex = layer * 1000 + row * 10 + column;
  const top = row * TILE_HEIGHT - layer * TILE_LAYER_OFFSET_Y + offsetY * TILE_HEIGHT;
  const left = column * TILE_WIDTH - layer * TILE_LAYER_OFFSET_X + offsetX * TILE_WIDTH;

  return (
    <div
      className="absolute transition-all duration-200"
      style={{
        zIndex,
        top,
        left,
        width: SVG_WIDTH,
        height: SVG_HEIGHT,
        cursor: isPlayable ? "pointer" : "not-allowed",
        filter: isPlayable ? "none" : "brightness(0.75)",
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (isPlayable) {
          onSelect?.();
        }
      }}
    >
      <svg width="74" height="98" viewBox="0 0 74 98" className="overflow-visible">
        <rect x="8" y="14" width="60" height="76" rx="4" fill="rgba(0,0,0,0.25)" />
        <polygon points="68,6 74,12 74,88 68,82" fill="#0A3F20" />
        <polygon points="8,82 14,88 74,88 68,82" fill="#0F5132" />
        <rect
          x="8"
          y="6"
          width="60"
          height="76"
          rx="3"
          fill={isSelected ? "#FFFBEA" : "#F4EAD4"}
          stroke={isSelected ? "#D97706" : "#C5B696"}
          strokeWidth={isSelected ? "2" : "1"}
        />
        <foreignObject x="12" y="10" width="52" height="68">
          <div className="flex h-full w-full items-center justify-center pointer-events-none select-none">
            {children ?? <span className="text-xs text-gray-400">Empty</span>}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default MahjongTile;
