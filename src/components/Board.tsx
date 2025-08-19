import { useEffect, useState, useRef } from "react";
import Tile from "./Tile";
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";
import { useMahjonggTileState } from "../hooks/useMahjonggTileState";

const Board = () => {
  const tiles = useMahjonggTileData();
  const {selectedTile, deselectTile, handleTileClick} = useMahjonggTileState();

  return (
    <div
      id="main-board"
      className="w-screen h-screen "
      onClick={deselectTile}
    >
      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTile || "No tile selected"}</h1>
      </div>
      <div className="w-screen max-w-screen h-screen flex flex-wrap gap-1 justify-center items-center">
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            generatedTile={tile.name}
            onClick={handleTileClick(tile.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
