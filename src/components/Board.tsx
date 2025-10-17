import Tile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";
import { useMahjonggTileData } from "../hooks/useMahjonggTileData";
import { generateTurtleLayout } from "../gameplay-features/game-logic/layout-builder";

const Board = () => {
  const { boardTiles, selectedTileName, deselectAllTiles, selectTile } =
    useMahjonggBoard();

// Tile pool for random assignment
  const tileData = useMahjonggTileData();

  // Backend layout positions
  const positions = generateTurtleLayout();

  // Assign a random tile to each position
  const randomizedTiles = positions.map((pos) => {
    const randomTile = tileData[Math.floor(Math.random() * tileData.length)];
    return {
      ...randomTile,
      position: pos,
      isSelected: false,
    };
  });

    
  //console.log(selectedTileName + " Board")
  const layer0Tiles = randomizedTiles.filter((t) => t.position.layer === 0);

  // Compute maximum columns and rows from tile positions
  const maxCol =
    Math.max(...boardTiles.map((t) => t.position?.gridColumn || 1)) || 1;
  const maxRow =
    Math.max(...boardTiles.map((t) => t.position?.gridRow || 1)) || 1;

  return (
    <div id="main-board" className="w-screen h-screen relative">
      
      {/* Background layer used for deselecting tiles */}
      <div className="absolute inset-0" onClick={deselectAllTiles}></div>
      
      {/* Header showing selected tile */}
      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTileName || "No tile selected"}</h1>
      </div>

      {/* Grid container for tiles */}
      <div
        className="inline-grid z-10 relative"
        style={{
          gridTemplateColumns: `repeat(${maxCol}, auto)`,
          gridTemplateRows: `repeat(${maxRow}, auto)`,
          gap: 0,
        }}
      >
        {layer0Tiles.map((tile) => (
          <div
            key={tile.name + tile.position.row + tile.position.col}
            style={{
              gridRowStart: tile.position.row + 1, // CSS Grid is 1-based
              gridColumnStart: tile.position.col + 1,
              zIndex: tile.position.layer,
            }}
          >
            <Tile
              name={tile.name}
              isSelected={tile.isSelected}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
