import { useState } from "react";
import Tile from "./Tile";

type TileType = {
  id: string;
  number: number;
};

const Board = () => {
  //   const createTiles = (): TileType[] => {
  //     // Create an array of 5 unique tile objects with IDs and numbers
  //     // Array.from({ length: 5 }) creates an array with 5 undefined elements
  //     const baseTiles = Array.from({ length: 5 }, (_, i) => ({
  //       id: `tile_${i + 1}_a`, // 'tile_1_a', 'tile_2_a', etc.
  //       number: i + 1, // tile number 1 through 5
  //     }));
  //     // Create duplicates of the base tiles
  //     // We map over baseTiles and create a new tile object for each one
  //     // The duplicate tile has an id with '_a' replaced by '_b' to keep IDs unique
  //     // The number stays the same because duplicates have the same value
  //     const duplicates = baseTiles.map((t) => ({
  //       id: t.id.replace("_a", "_b"), // e.g. 'tile_1_b'
  //       number: t.number,
  //     }));
  //     // Return a new array that combines baseTiles and duplicates using spread syntax
  //     // This gives a total of 10 tiles: 5 unique + 5 duplicates
  //     return [...baseTiles, ...duplicates];
  //   };

  //   // React state to hold the tiles array
  //   // useState<Tile[]> initializes state with the array returned by createTiles()
  //   // We destructure to get 'tiles' as the current state value
  //   // We don’t need the setter function here yet, so only 'tiles' is used
  //   const [tiles] = useState<TileType[]>(createTiles());

  const [clickedTile, setClickedTile] = useState("No tile clicked yet");

  const handleTileClick = () => {
    setClickedTile("Tile clicked");
    console.log("Tile Clicked")
  };

  return (
    <div>
      <h1>{clickedTile}</h1>
      <Tile onClick={handleTileClick} />
    </div>
  );
};

export default Board;
