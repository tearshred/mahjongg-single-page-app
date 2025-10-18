import { useMemo } from "react";
import Tile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";
import { filterLayer, computeGridSize } from "../utils/boardHelper";

const Board = () => {
  const { boardTiles, selectedTileName, deselectAllTiles, selectTile } =
    useMahjonggBoard();

  // 1️⃣ Filter tiles for layer 0 (can extend to multiple layers later)
  const layer0Tiles = useMemo(() => filterLayer(boardTiles, 0), [boardTiles]);

  // 2️⃣ Compute CSS Grid size based on tile positions
  const { maxCol, maxRow } = useMemo(() => computeGridSize(boardTiles), [boardTiles]);

  return (
    <div id="main-board" className="w-screen h-screen relative">
      {/* Background layer for deselect */}
      <div className="absolute inset-0" onClick={deselectAllTiles}></div>

      {/* Header showing selected tile */}
      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTileName || "No tile selected"}</h1>
      </div>

      {/* Grid container for tiles */}
      <div
        className="inline-grid relative z-10"
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
              gridRowStart: tile.position.gridRow, // ✅ use computed gridRow
              gridColumnStart: tile.position.gridColumn, // ✅ use computed gridColumn
              zIndex: tile.position.layer,
            }}
          >
            <Tile
              name={tile.name}
              isSelected={tile.isSelected}
              onSelect={() => selectTile(tile.name)} // ✅ selection updates state without regenerating
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
