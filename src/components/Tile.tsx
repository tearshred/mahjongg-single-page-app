import TileDesign from "./TileDesign";
import TileBase from "../assets/shared/TileBase.svg?react";
import type { TileProps } from "../types/TileProps";
import { getTileClassNames } from "../utils/tileStyler";

const Tile = ({ name, onSelect, isSelected }: TileProps) => {
  // Handler for the click event
  const tileClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Still need to stop propagation
    if (onSelect) {
      // Call the onSelect function provided by the parent (Board.tsx)
      // `.?` - optional chaining operator, meaning parent might not always pass the prop
      onSelect?.();
    }
  };

   const tileClassNames = getTileClassNames(isSelected ?? false);

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
      className={tileClassNames}
      onClick={tileClickHandler}
    >
      <TileBase className={`w-full h-full ${isSelected ? '!border-4 !border-blue-500' : 'border-4 border-transparent'} hover:border-gray-400`} />
      <TileDesign
        name={name}
        isSelected={isSelected}
        className="absolute top-0 left-0 p-4 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default Tile;
