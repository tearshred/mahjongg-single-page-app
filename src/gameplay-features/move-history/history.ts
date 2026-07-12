import type { TileDataWithState } from "../../types/tile-meta";

export type Snapshot = TileDataWithState[];

export interface MoveHistory {
  past: Snapshot[];
  future: Snapshot[];
}

export const emptyHistory = (): MoveHistory => ({ past: [], future: [] });

const MAX_HISTORY = 5;

export function pushMove(h: MoveHistory, snapshot: Snapshot): MoveHistory {
  const past = [...h.past, snapshot];
  if (past.length > MAX_HISTORY) past.shift();
  return { past, future: [] };
}

export function undo(
  h: MoveHistory,
  current: Snapshot
): { history: MoveHistory; tiles: Snapshot } | null {
  if (h.past.length === 0) return null;
  const past = [...h.past];
  const restored = past.pop()!;
  return { history: { past, future: [current, ...h.future] }, tiles: restored };
}

export function redo(
  h: MoveHistory,
  current: Snapshot
): { history: MoveHistory; tiles: Snapshot } | null {
  if (h.future.length === 0) return null;
  const future = [...h.future];
  const restored = future.shift()!;
  return { history: { past: [...h.past, current], future }, tiles: restored };
}
