import { useState } from "react";

// import type { Tile, TileName } from "../types/Tile";

export function useMahjonggTileState() {
  const [selectedTile, setSelectedTile] = useState<string>(" ");

  // handleTileClick is a higher-order function (curried function).
  // It takes the `tileName` of the clicked tile,
  // and RETURNS another function that React can use as an onClick handler.
  const handleTileClick = (tileName: string) =>
    // e is the event object from the click
    // React.MouseEvent<T> is React’s wrapper for the browser MouseEvent
    // <HTMLElement | SVGSVGElement> means the event could come from a normal HTML element (like <div>) OR an <svg> element
    (e: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
      e.stopPropagation(); // Prevents the parent div's onClick from firing
      setSelectedTile(tileName); // Store the clicked tile's name in state
      //console.log(tileName + " selected");
    };

    console.log(selectedTile)

    // Creating a custom hook in order to
    const deselectTile = () => setSelectedTile("");
    
    return { selectedTile, handleTileClick, deselectTile };
}
