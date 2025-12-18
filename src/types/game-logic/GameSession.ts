import type { TileDataWithState } from "../tile-meta";

/**
 * Represents a successful match that occurred during gameplay.
 * This is only created AFTER a match succeeds (TileMatchResult.success === true).
 * Used for:
 * - Move history (undo/redo)
 * - Game statistics (total matches, time per move)
 * - Replay functionality
 */
export interface MatchedPair {
  /**
   * The two tiles that were successfully matched and removed.
   * Tuple ensures exactly 2 tiles (not more, not less).
   * Index 0 = first tile clicked, Index 1 = second tile clicked.
   */
  tiles: [TileDataWithState, TileDataWithState];

  /** 
   * When this match occurred (milliseconds since Unix epoch).
   * Generated via Date.now() when the match happens.
   * Used to calculate time between moves and total game duration.
   */
  timestamp: number;
}

/**
 * The current state of the game session.
 * Controls what UI to show and which actions are allowed.
 */
export type GameStatus = "in-progress" | "won" | "lost" | "not-started";
