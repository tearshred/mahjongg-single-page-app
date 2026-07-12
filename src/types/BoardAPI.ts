import type { TileDataWithState } from "./tile-meta";

/**
 * The API returned by the useMahjonggBoard hook.
 * This provides everything a component needs to read from and manipulate the game board's state.
 * It is the control interface for the board's logic, separate from its visual configuration.
 */
export interface MahjonggBoardAPI {
  /**
   * The current state of every tile on the board.
   * This is the single source of truth for the game's UI and logic.
   * Use this array to map over and render tiles.
   */
  boardTiles: TileDataWithState[];

  /**
   * Toggles the selection state of a specific tile.
   * Identifies the tile by its unique position on the board.
   * @param tile - The tile object to select/deselect
   */
  selectTile: (tile: TileDataWithState) => void;

  /**
   * Deselects every tile on the board.
   * This is an action/command that modifies the state.
   */
  deselectAllTiles: () => void;

  /**
   * The currently selected tile object.
   * Null if no tile is selected.
   * This is derived/computed state.
   */
  selectedTile: TileDataWithState | null;

  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;

  // Future-proofing: Placeholder for essential game logic functions.
  /**
   * Checks if the currently selected tiles form a valid match.
   * (To be implemented in the future)
   */
  // checkMatch: () => boolean;

  /**
   * Removes matched tiles from the board.
   * (To be implemented in the future)
   */
  // removeMatchedTiles: () => void;
}
