import { useState, useMemo } from "react";
import Tile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";
import { useTileSize } from "../hooks/useTileSize";
import { useLayoutConfig } from "../hooks/useLayoutConfig";

const Board = () => {
  const { boardTiles, selectedTile, deselectAllTiles, selectTile } =
    useMahjonggBoard();
  const { gridDimensions } = useLayoutConfig(); // Get dynamic dimensions
  
  const { tileRef } = useTileSize();
  
  // Dynamic dimensions
  const maxCol = gridDimensions.columns;
  const maxRow = gridDimensions.rows;

  // Layer visibility state for debugging
  const [visibleLayers, setVisibleLayers] = useState([true, true, true, true, true]);

  // Filter tiles based on visible layers
  const visibleTiles = useMemo(() => 
    boardTiles.filter(tile => visibleLayers[tile.position.layer]), 
    [boardTiles, visibleLayers]
  );

  return (
    <div id="main-board" className="w-screen h-screen relative">
      <div className="absolute inset-0" onClick={deselectAllTiles}></div>

      <div className="w-screen flex justify-center items-center">
        <h1>{selectedTile ? `${selectedTile.name} at (layer ${selectedTile.position.layer}, row ${selectedTile.position.row}, column ${selectedTile.position.col})` : "No tile selected"}</h1>
      </div>

      {/* Layer visibility controls (temporary for debugging) */}
      <div className="absolute text-2xl top-8 left-4 p-2 rounded shadow z-50 flex gap-2">
        {[0, 1, 2, 3, 4].map(layer => (
          <label key={layer} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={visibleLayers[layer]}
              onChange={() => setVisibleLayers(prev => 
                prev.map((visible, i) => i === layer ? !visible : visible)
              )}
            />
            Layer {layer}
          </label>
        ))} 
      </div>

      {/* No visible layers message */}
{visibleTiles.length === 0 && (
  <div className="flex items-center justify-center text-4xl bg-opacity-75 z-50">
    No visible layers
  </div>
)}

      {/* Center the grid container */}
      <div className="w-full h-screen flex justify-center items-center">
        <div
          className="inline-grid relative z-10 perspective-1000"
          style={{
            gridTemplateColumns: `repeat(${maxCol}, minmax(min-content, max-content))`,
            gridTemplateRows: `repeat(${maxRow}, minmax(min-content, max-content))`,
            gap: 0,
            justifyItems: 'center', // Center items horizontally in their grid cells
            alignItems: 'center',   // Center items vertically in their grid cells
            transformStyle: 'preserve-3d' // Preserve 3D positioning
          }}
        >
          {visibleTiles.map((tile) => (
            <div
            // Unique key including layer to prevent React reusing DOM elements for same tile across layers
              key={`${tile.name}-${tile.position.layer}-${tile.position.row}-${tile.position.col}`}
              ref={tile.position.row === 0 && tile.position.col === 0 ? tileRef : undefined}
              className="transition-all duration-200 ease-in-out"
                style={{
                gridRow: tile.position.gridRowFractional ?? tile.position.gridRow,
                gridColumn: tile.position.gridColumn,
                zIndex: tile.position.layer,
              }}
            >
              <Tile
                name={tile.name}
                isSelected={tile.isSelected}
                onSelect={() => selectTile(tile)}
                floating={tile.position.floating}
                offsetX={tile.position.offsetX}
                offsetY={tile.position.offsetY}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
