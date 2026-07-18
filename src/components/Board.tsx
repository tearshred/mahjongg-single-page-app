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
  const { boardTiles, selectedTile, deselectAllTiles, selectTile, handleUndo, handleRedo, canUndo, canRedo, undoCount, totalTileCount } =
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

  // Debug panel visibility
  const [isDebugVisible, setIsDebugVisible] = useState(false);

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

  // Active = tiles still in the array and not in their removal animation.
  // Matched = tiles fully removed (no longer in array) + any currently animating out.
  const activeTileCount = useMemo(
    () => boardTiles.filter((tile) => !tile.isMatched).length,
    [boardTiles]
  );
  const matchedTileCount = totalTileCount - activeTileCount;

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
    if (totalTileCount === 0) return 0;
    return Math.round((matchedTileCount / totalTileCount) * 100);
  }, [totalTileCount, matchedTileCount]);

  // New Game confirmation modal
  const [isConfirmingNewGame, setIsConfirmingNewGame] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  // Debug overrides for testing UI states
  const [debugForceClear, setDebugForceClear] = useState(false);
  const [debugForceDeadlock, setDebugForceDeadlock] = useState(false);
  const [debugFreezeTimer, setDebugFreezeTimer] = useState(false);

  const isClear = debugForceClear || activeTileCount === 0;
  const isDeadlock = !isClear && (debugForceDeadlock || (availableTileCount > 0 && availableMoves === 0));
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
  // Ref keeps the interval callback up-to-date without changing dep array size
  const isClearRef = useRef(false);
  isClearRef.current = isClear || isDeadlock || debugFreezeTimer || isConfirmingNewGame;
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isClearRef.current) setElapsedSeconds((s) => s + 1);
    }, 1000);
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

      {/* Debug panel toggle button (visible when panel is hidden) */}
      {!isDebugVisible && (
        <button
          onClick={() => setIsDebugVisible(true)}
          className="absolute left-3 top-3 z-50 rounded border border-green-300/40 bg-black/80 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-green-300 shadow-lg backdrop-blur-sm transition-colors hover:bg-green-300/10 active:bg-green-300/20"
        >
          DBG
        </button>
      )}

      {/* Debug panel */}
      {isDebugVisible && (
        <div
          className="absolute left-3 top-3 bottom-3 z-50 w-64 overflow-y-auto rounded border border-green-300/40 bg-black/95 text-green-100 shadow-lg"
          style={{
            fontFamily: "Monaco, Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace",
            letterSpacing: "0.025em",
          }}
        >
          {/* Header with hide button */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-black/95 px-3 pt-3 pb-2 border-b border-green-300/20">
            <div className="text-xs uppercase tracking-[0.2em] text-green-300/70">Debug Console</div>
            <button
              onClick={() => setIsDebugVisible(false)}
              className="flex h-7 w-7 items-center justify-center rounded border border-green-300/30 text-green-300/60 transition-colors hover:border-green-300/60 hover:text-green-300 active:bg-green-300/10"
              aria-label="Hide debug panel"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-3">
            {/* Group 1: Layers */}
            <div className="rounded border border-green-300/30 bg-black/40 p-2">
              <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
                Group 1: Layers
              </div>
              <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1 text-xs">
                {layerIndices.map((layer) => (
                  <label key={layer} className="flex min-h-[36px] items-center justify-between gap-2 rounded px-1 hover:bg-green-300/10 active:bg-green-300/15">
                    <span>Layer {layer + 1}</span>
                    <input
                      type="checkbox"
                      checked={visibleLayers[layer] ?? true}
                      onChange={() =>
                        setVisibleLayers((prev) =>
                          prev.map((visible, i) => (i === layer ? !visible : visible))
                        )
                      }
                      className="h-4 w-4 accent-green-300"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Group 2: Selection */}
            <div className="rounded border border-green-300/30 bg-black/40 p-2">
              <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
                Group 2: Selection
              </div>
              <div className="w-full overflow-hidden">
                <span className="block truncate text-xs" title={selectedTile ? `${selectedTile.name} [L${selectedTile.position.layer + 1} R${selectedTile.position.row} C${selectedTile.position.col}]` : "NONE"}>
                  {selectedTile
                    ? `${selectedTile.name} [L${selectedTile.position.layer + 1} R${selectedTile.position.row} C${selectedTile.position.col}]`
                    : "SELECTED NONE"}
                </span>
              </div>
            </div>

            {/* Group 3: Status */}
            <div className="rounded border border-green-300/30 bg-black/40 p-2 text-xs">
              <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
                Group 3: Status
              </div>
              <div className="space-y-1">
                <div className="flex justify-between gap-2"><span className="text-green-300/60">LAYERS</span><span>{visibleLayers.filter(Boolean).length}/{layerIndices.length}</span></div>
                <div className="flex justify-between gap-2"><span className="text-green-300/60">VISIBLE</span><span>{visibleTiles.length}/{activeTileCount}</span></div>
                <div className="flex justify-between gap-2"><span className="text-green-300/60">MATCHED</span><span>{matchedTileCount}</span></div>
                <div className="flex justify-between gap-2"><span className="text-green-300/60">UNRESOLVED</span><span className={unresolvedTileNames.length > 0 ? "text-amber-300" : ""}>{unresolvedTileNames.length}</span></div>
              </div>
              {unresolvedTileNames.length > 0 && (
                <div className="mt-1 break-all text-[10px] text-amber-200/90">
                  {unresolvedTileNames.join(", ")}
                </div>
              )}
            </div>

            {/* Group 4: Gameplay Logs */}
            <div className="rounded border border-green-300/30 bg-black/40 p-2 text-xs">
              <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
                Group 4: Gameplay
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-green-300/60">AVAILABLE</span>
                  <span className={availableTileCount > 0 ? "text-emerald-300" : "text-rose-300"}>{availableTileCount}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-green-300/60">MATCHED</span>
                  <span className={matchedTileCount > 0 ? "text-sky-300" : "text-slate-300"}>{matchedTileCount}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-green-300/60">BLOCKED</span>
                  <span className={unavailableTileCount > availableTileCount ? "text-amber-300" : "text-green-300"}>{unavailableTileCount}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-green-300/60">MOVES</span>
                  <span className={availableMoves > 0 ? "text-emerald-300" : "text-rose-300"}>{availableMoves}</span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-green-300/20 pt-1">
                  <span className="text-green-300/60">STATUS</span>
                  <span className={isClear ? "text-cyan-300" : isDeadlock ? "text-rose-300" : "text-emerald-300"}>{solvabilityLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-green-300/60">DONE</span>
                  <span className="text-cyan-300">{completionPercent}%</span>
                </div>
                <div className="text-[10px] text-green-200/50">{completionLabel}</div>
              </div>
            </div>

            {/* Group 5: History */}
            <div className="rounded border border-green-300/30 bg-black/40 p-2 text-xs">
              <div className="mb-2 border-b border-green-300/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-green-300/75">
                Group 5: History
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="flex-1 min-h-[40px] rounded border border-green-300/40 px-2 py-2 text-[11px] uppercase tracking-wider transition-colors hover:bg-green-300/10 active:bg-green-300/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ↩ Undo {canUndo ? `(${undoCount}/5)` : ""}
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="flex-1 min-h-[40px] rounded border border-green-300/40 px-2 py-2 text-[11px] uppercase tracking-wider transition-colors hover:bg-green-300/10 active:bg-green-300/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ↪ Redo
                </button>
              </div>
              <div className="mt-1 text-[10px] text-green-200/50">Ctrl+Z / Ctrl+Y</div>
            </div>

            {/* Group 6: Testing */}
            <div className="rounded border border-amber-400/40 bg-black/40 p-2 text-xs">
              <div className="mb-2 border-b border-amber-400/20 pb-1 text-[11px] uppercase tracking-[0.16em] text-amber-400/80">
                Group 6: Testing
              </div>

              {/* Win state */}
              <div className="mb-2">
                <button
                  onClick={() => { setDebugForceClear(v => !v); setDebugForceDeadlock(false); }}
                  className={`w-full min-h-[36px] rounded border px-2 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${
                    debugForceClear
                      ? "border-amber-400/80 bg-amber-400/20 text-amber-300"
                      : "border-green-300/30 hover:bg-green-300/10 active:bg-green-300/20"
                  }`}
                >
                  {debugForceClear ? "✓ Win Active" : "Toggle Win"}
                </button>
              </div>

              {/* Timer */}
              <div className="mb-2">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-green-300/40">Timer</div>
                <button
                  onClick={() => setDebugFreezeTimer(v => !v)}
                  className={`w-full min-h-[36px] rounded border px-2 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${
                    debugFreezeTimer
                      ? "border-sky-400/80 bg-sky-400/20 text-sky-300"
                      : "border-green-300/30 hover:bg-green-300/10 active:bg-green-300/20"
                  }`}
                >
                  {debugFreezeTimer ? "✓ Timer Frozen" : "Freeze Timer"}
                </button>
              </div>

              {/* Lose state */}
              <div className="mb-2">
                <button
                  onClick={() => { setDebugForceDeadlock(v => !v); setDebugForceClear(false); }}
                  className={`w-full min-h-[36px] rounded border px-2 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${
                    debugForceDeadlock
                      ? "border-rose-500/80 bg-rose-500/20 text-rose-400"
                      : "border-green-300/30 hover:bg-green-300/10 active:bg-green-300/20"
                  }`}
                >
                  {debugForceDeadlock ? "✓ Loss Active" : "Toggle Loss"}
                </button>
              </div>

              {/* Reset all */}
              <button
                onClick={() => { setDebugForceClear(false); setDebugForceDeadlock(false); setDebugFreezeTimer(false); }}
                disabled={!debugForceClear && !debugForceDeadlock && !debugFreezeTimer}
                className="w-full min-h-[36px] rounded border border-green-300/20 px-2 py-1.5 text-[11px] uppercase tracking-wider text-green-300/50 transition-colors hover:bg-green-300/10 hover:text-green-300 active:bg-green-300/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Reset All Overrides
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Won banner */}
      {isClear && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
          <span className="text-5xl font-black tracking-widest text-amber-300 drop-shadow-[0_2px_16px_rgba(251,191,36,0.7)]">
            CONGRATULATIONS
          </span>
        </div>
      )}

      {/* Game Over overlay */}
      {isDeadlock && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <span className="text-7xl font-black tracking-widest text-red-500 drop-shadow-[0_2px_24px_rgba(239,68,68,0.8)]">
            GAME OVER
          </span>
        </div>
      )}

      {/* No visible layers message (non-game states only) */}
      {visibleTiles.length === 0 && !isClear && (
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

      {/* Undo / Redo — top-right */}
      <div className="absolute top-4 right-4 z-[60] flex gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-semibold tracking-widest text-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          ↩
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="rounded-lg border border-white/20 bg-black/60 px-4 py-2 text-sm font-semibold tracking-widest text-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          ↪
        </button>
      </div>

      {/* Fullscreen + New Game — bottom-right */}
      <div className="absolute bottom-4 right-4 z-[60] flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="rounded-lg border border-white/20 bg-black/60 px-4 py-2.5 text-sm font-semibold uppercase tracking-widest text-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? "⛶" : "⛶"}
          <span className="ml-1.5">{isFullscreen ? "Exit" : "Fullscreen"}</span>
        </button>
        <button
          onClick={() => setIsConfirmingNewGame(true)}
          className="rounded-lg border border-white/20 bg-black/60 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white/80 shadow-lg backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          New Game
        </button>
      </div>

      {/* New Game confirmation modal */}
      {isConfirmingNewGame && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsConfirmingNewGame(false)} />
          {/* Modal card */}
          <div className="relative z-10 flex flex-col items-center gap-6 rounded-2xl border border-white/20 bg-black/90 px-10 py-8 shadow-2xl">
            <p className="text-center text-lg font-semibold tracking-wide text-white/90">
              Start a new game?
            </p>
            <p className="text-center text-sm text-white/50">
              Current progress will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsConfirmingNewGame(false);
                  onNewGame();
                }}
                className="rounded-lg border border-rose-400/60 bg-rose-500/20 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-rose-300 transition-colors hover:bg-rose-500/35 hover:text-rose-200"
              >
                Yes, Restart
              </button>
              <button
                onClick={() => setIsConfirmingNewGame(false)}
                className="rounded-lg border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keep the board clear of the left debug panel */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center overflow-auto px-2 pb-2 pt-2 transition-[left] duration-200"
        style={{
          left: isDebugVisible ? "17rem" : "0",
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
