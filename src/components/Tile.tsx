import TileDesign from "./TileDesign";
import TileBase from "../assets/shared/TileBase.svg?react";
import type { TileProps } from "../types/TileProps";
import { useMahjonggTileState } from "../hooks/useMahjonggTileState";

const Tile = ({ name, onClick, isSelected }: TileProps) => {

   // Use the tile state hook
  const { handleTileClick } = useMahjonggTileState();

  // The hook returns a function that needs the tile name.
  // We call it here with this tile's name to get the final click handler.
  const tileClickHandler = handleTileClick(name);

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
      className="relative inline-block w-30 h-auto cursor-pointer m-1"
      onClick={tileClickHandler}
    >
      <TileBase className="w-full h-full" />
      <TileDesign
        name={name}
        isSelected={isSelected}
        className="absolute top-0 left-0 p-4 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default Tile;
