import { useRef, useState } from "react";
import {
  emptyHistory,
  pushMove,
  undo as historyUndo,
  redo as historyRedo,
} from "./history";
import type { MoveHistory, Snapshot } from "./history";

export function useHistory() {
  // Keep history in a ref so undo/redo can read+write synchronously inside
  // setBoardTiles updaters without stale-closure issues.
  const historyRef = useRef<MoveHistory>(emptyHistory());
  // A parallel state bit solely to trigger re-renders when canUndo/canRedo change.
  const [, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const recordMove = (snapshot: Snapshot) => {
    historyRef.current = pushMove(historyRef.current, snapshot);
    bump();
  };

  const undo = (current: Snapshot): Snapshot | null => {
    const result = historyUndo(historyRef.current, current);
    if (!result) return null;
    historyRef.current = result.history;
    bump();
    return result.tiles;
  };

  const redo = (current: Snapshot): Snapshot | null => {
    const result = historyRedo(historyRef.current, current);
    if (!result) return null;
    historyRef.current = result.history;
    bump();
    return result.tiles;
  };

  return {
    recordMove,
    undo,
    redo,
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0,
    undoCount: historyRef.current.past.length,
  };
}
