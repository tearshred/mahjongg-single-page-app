import Tile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";

const Board = () => {
 
  const {boardTiles, selectedTileName, deselectAllTiles, selectTile} = useMahjonggBoard();

  //console.log(selectedTileName + " Board")

  return (
    <div
      id="main-board"
      className="w-screen h-screen "
      onClick={deselectAllTiles}
    >
      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTileName || "No tile selected"}</h1>
      </div>
      <div className="w-screen max-w-screen h-screen flex flex-wrap gap-1 justify-center items-center">
        {boardTiles.map(tile => (
          <Tile
            key={tile.name}
            name={tile.name}
            isSelected={tile.isSelected}
            onSelect={() => selectTile(tile.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
