import type { TileDataWithState } from "./TileState";

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
   * Selects a specific tile by its name and deselects all others.
   * This is an action/command that modifies the state.
   * @param tileName - The name of the tile to select (e.g., "Bamboo1")
   */
  selectTile: (tileName: string) => void;

  /**
   * Deselects every tile on the board.
   * This is an action/command that modifies the state.
   */
  deselectAllTiles: () => void;

  /**
   * The name of the currently selected tile, or an empty string if none is selected.
   * This is a derived value for convenience, easily calculated from boardTiles.
   */
  selectedTileName: string;

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