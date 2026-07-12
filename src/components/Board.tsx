import { useState, useMemo, useEffect } from "react";
import MahjongTile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";
import { useMahjonggTileDesign } from "../hooks/useMahjonggTileDesign";
import { useLayoutConfig } from "../hooks/useLayoutConfig";
import {
  TILE_HEIGHT,
  TILE_HORIZONTAL_STEP,
  TILE_LAYER_OFFSET_X,
  TILE_LAYER_OFFSET_Y,
  TILE_VERTICAL_STEP,
  TILE_WIDTH,
} from "../utils/tilePlacement";

const Board = () => {
  const { boardTiles, selectedTile, deselectAllTiles, selectTile, hasAnyMove } =
    useMahjonggBoard();
  const { getTileDesign } = useMahjonggTileDesign();
  const { gridDimensions } = useLayoutConfig(); // Get dynamic dimensions

  // Dynamic dimensions
  const maxCol = gridDimensions.columns;
  const maxRow = gridDimensions.rows;
  const maxLayer = useMemo(
    () => boardTiles.reduce((highestLayer, tile) => Math.max(highestLayer, tile.position.layer), 0),
    [boardTiles]
  );
  const layerIndices = useMemo(
    () => Array.from({ length: maxLayer + 1 }, (_, i) => i),
    [maxLayer]
  );
  const boardPaddingLeft = TILE_LAYER_OFFSET_X * (maxLayer + 1) + 10;
  const boardPaddingTop = TILE_LAYER_OFFSET_Y * (maxLayer + 1) + 12;
  const boardWidth = boardPaddingLeft + (maxCol - 1) * TILE_HORIZONTAL_STEP + TILE_WIDTH + 24;
  const boardHeight = boardPaddingTop + (maxRow - 1) * TILE_VERTICAL_STEP + TILE_HEIGHT + 32;

  // Layer visibility state for debugging
  const [visibleLayers, setVisibleLayers] = useState<boolean[]>(() =>
    Array.from({ length: maxLayer + 1 }, () => true)
  );

  useEffect(() => {
    setVisibleLayers((previous) => {
      if (previous.length === maxLayer + 1) return previous;
      return Array.from({ length: maxLayer + 1 }, (_, i) => previous[i] ?? true);
    });
  }, [maxLayer]);

  // Filter tiles based on visible layers
  const visibleTiles = useMemo(() => 
    boardTiles.filter(tile => visibleLayers[tile.position.layer] ?? true), 
    [boardTiles, visibleLayers]
  );

  const getTileIcon = (tileName: string) => {
    const SymbolComponent = getTileDesign(tileName);

    if (!SymbolComponent) {
      return <span className="text-[10px] font-semibold text-slate-500">{tileName}</span>;
    }

    return <SymbolComponent className="h-full w-full" />;
  };

  return (
    <div
      id="main-board"
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #8a2034 0%, #6f1728 36%, #55111f 72%, #3b0a15 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div className="absolute inset-0 z-0" onClick={deselectAllTiles}></div>

      <div
        className="absolute left-3 top-3 bottom-3 z-50 w-64 overflow-hidden rounded border border-green-300/40 bg-black/95 p-3 text-green-100 shadow-lg"
        style={{
          fontFamily: "Monaco, Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace",
          letterSpacing: "0.025em",
        }}
      >
        <div className="text-xs uppercase tracking-[0.2em] text-green-300/70">Board Debug Console</div>

        <div className="mt-3 rounded border border-green-300/30 bg-black/40 p-2">
          <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
            Group 1: Layers
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1 text-xs">
            {layerIndices.map((layer) => (
              <label key={layer} className="flex items-center justify-between gap-2 whitespace-nowrap rounded px-1 py-0.5 hover:bg-green-300/10">
                <span>Layer {layer + 1}</span>
                <input
                  type="checkbox"
                  checked={visibleLayers[layer] ?? true}
                  onChange={() =>
                    setVisibleLayers((prev) =>
                      prev.map((visible, i) => (i === layer ? !visible : visible))
                    )
                  }
                  className="h-3 w-3 accent-green-300"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded border border-green-300/30 bg-black/40 p-2">
          <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
            Group 2: Selection
          </div>
          <span className="block min-w-0 break-words text-xs">
            {selectedTile
              ? `SELECTED ${selectedTile.name} [L${selectedTile.position.layer + 1} R${selectedTile.position.row} C${selectedTile.position.col}]`
              : "SELECTED NONE"}
          </span>
        </div>

        <div className="mt-3 rounded border border-green-300/30 bg-black/40 p-2 text-xs">
          <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
            Group 3: Status
          </div>
          <div>VISIBLE LAYERS {visibleLayers.filter(Boolean).length}/{layerIndices.length}</div>
          <div>VISIBLE TILES {visibleTiles.length}/{boardTiles.length}</div>
          <div className={hasAnyMove ? "text-green-300" : "text-red-400 font-semibold"}>
            {hasAnyMove ? "MOVES AVAILABLE" : "NO MOVES — STUCK"}
          </div>
        </div>
      </div>

      {/* No-moves overlay */}
      {!hasAnyMove && boardTiles.some((t) => !t.isMatched) && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
          <div className="rounded-lg border border-red-400/60 bg-black/80 px-8 py-5 text-center shadow-2xl">
            <div className="text-2xl font-bold text-red-400">No moves available</div>
            <div className="mt-1 text-sm text-red-300/70">Shuffle the board to continue</div>
          </div>
        </div>
      )}

      {/* No visible layers message */}
      {visibleTiles.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-4xl">
          No visible layers
        </div>
      )}

      {/* Keep the board clear of the left debug panel */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center overflow-auto px-2 pb-2 pt-2"
        style={{
          left: "17rem",
        }}
      >
        <div
          className="relative z-10"
          style={{
            width: boardWidth,
            height: boardHeight,
            paddingLeft: boardPaddingLeft,
            paddingTop: boardPaddingTop,
            boxSizing: "border-box",
            transformStyle: "preserve-3d",
          }}
        >
          {visibleTiles.map((tile) => {
            return (
              <MahjongTile
                key={`${tile.name}-${tile.position.layer}-${tile.position.row}-${tile.position.col}`}
                layer={tile.position.layer}
                row={tile.position.row}
                column={tile.position.col}
                isSelected={tile.isSelected}
                isPlayable={tile.isPlayable}
                offsetX={tile.position.offsetX}
                offsetY={tile.position.offsetY}
                onSelect={() => selectTile(tile)}
              >
                {getTileIcon(tile.name)}
              </MahjongTile>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Board;
