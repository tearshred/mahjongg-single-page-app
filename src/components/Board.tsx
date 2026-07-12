import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import MahjongTile from "./Tile";
import { useMahjonggBoard } from "../hooks/useMahjonggBoard";
import { useMahjonggTileDesign } from "../hooks/useMahjonggTileDesign";
import { useLayoutConfig } from "../hooks/useLayoutConfig";
import { areTilesMatch } from "../gameplay-features/game-logic/tile-rules";
import {
  TILE_HEIGHT,
  TILE_HORIZONTAL_STEP,
  TILE_LAYER_OFFSET_X,
  TILE_LAYER_OFFSET_Y,
  TILE_VERTICAL_STEP,
  TILE_WIDTH,
} from "../utils/tilePlacement";

const Board = ({ onNewGame }: { onNewGame: () => void }) => {
  const { boardTiles, selectedTile, deselectAllTiles, selectTile, handleUndo, handleRedo, canUndo, canRedo, undoCount } =
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
  const visibleTiles = useMemo(
    () =>
      boardTiles.filter(
        (tile) => !tile.isMatched && (visibleLayers[tile.position.layer] ?? true)
      ),
    [boardTiles, visibleLayers]
  );

  const matchedTileCount = useMemo(
    () => boardTiles.filter((tile) => tile.isMatched).length,
    [boardTiles]
  );
  const activeTileCount = boardTiles.length - matchedTileCount;

  const availableTileCount = useMemo(
    () => boardTiles.filter((tile) => !tile.isMatched && tile.isPlayable).length,
    [boardTiles]
  );

  const unavailableTileCount = useMemo(
    () => boardTiles.filter((tile) => !tile.isMatched && !tile.isPlayable).length,
    [boardTiles]
  );

  const availableMoves = useMemo(() => {
    const availableTiles = boardTiles.filter((tile) => !tile.isMatched && tile.isPlayable);
    let moves = 0;

    for (let i = 0; i < availableTiles.length; i += 1) {
      for (let j = i + 1; j < availableTiles.length; j += 1) {
        if (areTilesMatch(availableTiles[i], availableTiles[j])) {
          moves += 1;
        }
      }
    }

    return moves;
  }, [boardTiles]);

  const completionPercent = useMemo(() => {
    if (boardTiles.length === 0) {
      return 0;
    }

    return Math.round((matchedTileCount / boardTiles.length) * 100);
  }, [boardTiles.length, matchedTileCount]);

  const isDeadlock = availableTileCount > 0 && availableMoves === 0;
  const isClear = activeTileCount === 0;
  const solvabilityLabel = isClear ? "CLEAR" : isDeadlock ? "DEADLOCK" : "PLAYABLE";
  const completionLabel = isClear
    ? "COMPLETE"
    : `${activeTileCount} ACTIVE / ${matchedTileCount} MATCHED`;

  const unresolvedTileNames = useMemo(() => {
    const missing = new Set<string>();

    boardTiles.forEach((tile) => {
      if (!getTileDesign(tile.name)) {
        missing.add(tile.name);
      }
    });

    return Array.from(missing).sort();
  }, [boardTiles, getTileDesign]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.key === "y" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey)
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo, handleRedo]);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const formattedTime = useCallback(() => {
    const h = Math.floor(elapsedSeconds / 3600);
    const m = Math.floor((elapsedSeconds % 3600) / 60);
    const s = elapsedSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [elapsedSeconds]);

  const lastUnresolvedSignatureRef = useRef<string>("");

  useEffect(() => {
    if (unresolvedTileNames.length === 0) {
      lastUnresolvedSignatureRef.current = "";
      return;
    }

    const signature = unresolvedTileNames.join("|");
    if (signature === lastUnresolvedSignatureRef.current) {
      return;
    }

    console.warn("Tile symbol lookup failed for names:", unresolvedTileNames);
    lastUnresolvedSignatureRef.current = signature;
  }, [unresolvedTileNames]);

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
          <div>VISIBLE TILES {visibleTiles.length}/{activeTileCount}</div>
          <div>MATCHED TILES {matchedTileCount}</div>
          <div>UNRESOLVED SYMBOLS {unresolvedTileNames.length}</div>
          {unresolvedTileNames.length > 0 && (
            <div className="mt-1 break-words text-[10px] text-amber-200/90">
              {unresolvedTileNames.join(", ")}
            </div>
          )}
        </div>

        <div className="mt-3 rounded border border-green-300/30 bg-black/40 p-2 text-xs">
          <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
            Group 4: Gameplay Logs
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>AVAILABLE TILES</span>
            <span className={availableTileCount > 0 ? "text-emerald-300" : "text-rose-300"}>{availableTileCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>MATCHED TILES</span>
            <span className={matchedTileCount > 0 ? "text-sky-300" : "text-slate-300"}>{matchedTileCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>UNAVAILABLE TILES</span>
            <span className={unavailableTileCount > availableTileCount ? "text-amber-300" : "text-green-300"}>{unavailableTileCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>AVAILABLE MOVES</span>
            <span className={availableMoves > 0 ? "text-emerald-300" : "text-rose-300"}>{availableMoves}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 border-t border-green-300/20 pt-1">
            <span>SOLVABILITY</span>
            <span
              className={
                isClear ? "text-cyan-300" : isDeadlock ? "text-rose-300" : "text-emerald-300"
              }
            >
              {solvabilityLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>COMPLETION</span>
            <span className="text-cyan-300">{completionPercent}%</span>
          </div>
          <div className="break-words text-[10px] text-green-200/80">{completionLabel}</div>
        </div>

        <div className="mt-3 rounded border border-green-300/30 bg-black/40 p-2 text-xs">
          <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
            Group 5: History
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="flex-1 rounded border border-green-300/40 px-2 py-1 text-[11px] uppercase tracking-wider transition-colors hover:bg-green-300/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↩ Undo {canUndo ? `(${undoCount}/5)` : ""}
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="flex-1 rounded border border-green-300/40 px-2 py-1 text-[11px] uppercase tracking-wider transition-colors hover:bg-green-300/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↪ Redo
            </button>
          </div>
          <div className="mt-1 text-[10px] text-green-200/50">Ctrl+Z / Ctrl+Y</div>
        </div>
      </div>

      {/* No visible layers message */}
      {visibleTiles.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-4xl">
          No visible layers
        </div>
      )}

      {/* Session timer — center bottom */}
      <div
        className="pointer-events-none absolute bottom-4 left-0 right-0 z-50 flex justify-center"
      >
        <div
          className="rounded-lg border border-white/20 bg-black/60 px-5 py-2 text-sm font-semibold tracking-widest text-white/80 shadow-lg backdrop-blur-sm"
          style={{ fontFamily: "Monaco, Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace" }}
        >
          {formattedTime()}
        </div>
      </div>

      {/* New Game button — bottom-right, opposite the debug panel */}
      <button
        onClick={onNewGame}
        className="absolute bottom-4 right-4 z-50 rounded-lg border border-white/20 bg-black/60 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
      >
        New Game
      </button>

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
