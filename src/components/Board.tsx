import { useEffect, useState, useRef } from "react";
import Tile from "./Tile";
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";

const Board = () => {
  const tiles = useMahjonggTileData();

  // useRef stores a value that stays the same across rerenders, so we can track if the code has already run.
  const hasRun = useRef(false);

  const [selectedTile, setSelectedTile] = useState("No tile selected yet");
  const [generatedTile, setGeneratedTile] = useState("Name: ");

  useEffect(() => {
    // !hasRun.current "flips" the current boolean value in order to detect that it mounted the component already
    // reduces unnecessary re-renders
    if (!hasRun.current && tiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      console.log("Name:", tiles[randomIndex].name);
      setGeneratedTile(tiles[randomIndex].name);
      hasRun.current = true; // Ensuring it does mark the component as mounted already
    }
  }, [tiles]);

  const handleTileClick = (
    e: React.MouseEvent<HTMLElement | SVGSVGElement>
  ) => {
    e.stopPropagation(); //Stops the parent div click
    setSelectedTile(generatedTile + " selected");
    console.log(selectedTile);
  };

  return (
    <div
      id="main-board"
      className="w-screen h-screen "
      onClick={() => setSelectedTile("Tile deselected")}
    >
      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTile}</h1>
      </div>
      <div className="w-screen h-screen flex justify-center items-center">
        <Tile 
          generatedTile={generatedTile}
          onClick={handleTileClick} 
        />
      </div>
    </div>
  );
};

export default Board;
