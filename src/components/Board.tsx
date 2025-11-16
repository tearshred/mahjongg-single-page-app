import { useMemo } from "react";
import Tile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";
import { filterLayer } from "../utils/boardHelper";
import { useTileSize } from "../hooks/useTileSize";
import { turtleGridDimensions } from "../gameplay-features/layouts/turtle-layout";

const Board = () => {
  const { boardTiles, selectedTileName, deselectAllTiles, selectTile } =
    useMahjonggBoard();
  
  const { tileRef } = useTileSize();
  const layer0Tiles = useMemo(() => filterLayer(boardTiles, 0), [boardTiles]);
  
  // v1: Using explicit turtle layout dimensions
  // TODO: Make dynamic when supporting multiple layouts
  const maxCol = turtleGridDimensions.columns;
  const maxRow = turtleGridDimensions.rows;

  return (
    <div id="main-board" className="w-screen h-screen relative">
      <div className="absolute inset-0" onClick={deselectAllTiles}></div>

      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTileName || "No tile selected"}</h1>
      </div>

      {/* Center the grid container */}
      <div className="w-full h-screen flex justify-center items-center">
        <div
          className="inline-grid relative z-10"
          style={{
            gridTemplateColumns: `repeat(${maxCol}, minmax(min-content, max-content))`,
            gridTemplateRows: `repeat(${maxRow}, minmax(min-content, max-content))`,
            gap: 0,
            justifyItems: 'center', // Center items horizontally in their grid cells
            alignItems: 'center',   // Center items vertically in their grid cells
          }}
        >
          {layer0Tiles.map((tile) => (
            <div
              key={tile.name + tile.position.row + tile.position.col}
              ref={tile.position.row === 0 && tile.position.col === 0 ? tileRef : undefined}
              className="transition-all duration-200 ease-in-out"
              style={{
                gridRow: tile.position.gridRow,
                gridColumn: tile.position.gridColumn,
                transform: tile.position.floating ? 'translateY(-50%)' : 'none',
                zIndex: tile.position.layer,
              }}
            >
              <Tile
                name={tile.name}
                isSelected={tile.isSelected}
                onSelect={() => selectTile(tile.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
