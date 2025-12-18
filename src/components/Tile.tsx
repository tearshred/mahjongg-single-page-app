import TileDesign from "./TileDesign";
import TileBaseRect from "../assets/shared/TileBaseRect.svg?react";
import { useTileSize } from "../hooks/useTileSize";
import type { TileProps } from "../types/tile-meta";

// The Tile component now accepts optional floating/offset props and
// computes pixel transforms using the measured tile size for pixel-perfect
// alignment of floating tiles.
const Tile = ({
  name,
  onSelect,
  isSelected,
  floating: _floating,
  offsetX,
  offsetY,
}: TileProps) => {
  // Handler for the click event
  const tileClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Still need to stop propagation
    if (onSelect) {
      // Call the onSelect function provided by the parent (Board.tsx)
      // `.?` - optional chaining operator, meaning parent might not always pass the prop
      onSelect?.();
    }
  };

  // Measure this tile so we can convert fractional offsets into pixels
  const { tileRef, tileSize } = useTileSize();
  const translateX = (offsetX ?? 0) * (tileSize.width || 0);
  const translateY = (offsetY ?? 0) * (tileSize.height || 0);
  const transformStyle = {
    transform: `translate(${translateX}px, ${translateY}px)`,
  };

  // Debugging: log offsets/computed pixels for floating tiles
  if ((offsetX ?? 0) !== 0 || (offsetY ?? 0) !== 0) {
    // eslint-disable-next-line no-console
    console.debug(`Tile:${name} offsets:`, {
      offsetX,
      offsetY,
      tileSize,
      translateX,
      translateY,
    });
  }

  return (
    // This wrapper div serves three crucial purposes:
    // 1. **Click Containment:** It creates a fixed-size clickable area (w-30 h-auto).
    //    The cursor pointer will ONLY appear within this box, preventing it from
    //    appearing on the empty space around the SVG caused by absolute positioning.
    // 2. **Positioning Context:** The 'relative' class creates a anchor point for the
    //    absolutely positioned TileDesign (the symbol) inside, ensuring it aligns
    //    perfectly with the TileBase underneath.
    // 3. **Event Delegation:** It handles the click event at the parent level. This
    //    is more reliable than attaching the event to the SVGs themselves, as it
    //    captures all clicks within the tile's boundaries and avoids issues with
    //    transparent parts of the SVG or pointer-events.
    <div
      ref={tileRef}
      onClick={tileClickHandler}
      style={transformStyle}
      className={`relative block w-[120px] h-[158px] cursor-pointer ${
        isSelected ? "ring-4 ring-red-500" : ""
      }`}
    >
      <TileBaseRect className="block w-full h-full" />
      <TileDesign
        name={name}
        isSelected={isSelected}
        className="absolute top-0 left-[8px] w-[112px] h-[150px] p-3 pointer-events-none"
      />
    </div>
  );
};

export default Tile;
