import { useState } from "react";
import { useMahjonggTileData } from "./useMahjonggTileData";
import type { TileDataWithState } from "../types/TileState";
import type { MahjonggBoardAPI } from "../types/BoardAPI";

// Tells TypeScript: "This function promises to return an object that
// matches the MahjonggBoardAPI structure."
export function useMahjonggBoard(): MahjonggBoardAPI {
  // Storing the list of tiles inside the `tileData` variable
  const tileData = useMahjonggTileData();

  // Mapping the metadata to a combined TileDataWithState
  const initialTileState: TileDataWithState[] = tileData.map((tile) => ({
    ...tile, // metadata: name, path, Component, value
    isSelected: false, // initial UI state
    isClicked: false, // initial UI state
    isHighlighted: false, // initial UI state
    value: tile.value ?? tile.name, // fallback in case value is undefined
  }));

  const [boardTiles, setBoardTiles] =
    useState<TileDataWithState[]>(initialTileState);

  // 2. ADD THE NEW FUNCTIONS HERE (They use the existing state/setter)
  const selectTile = (tileName: string) => {
    setBoardTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        isSelected: tile.name === tileName,
      }))
    );
  };

  const deselectAllTiles = () => {
    setBoardTiles((prevTiles) =>
      prevTiles.map((tile) => ({ ...tile, isSelected: false }))
    );
  };

  const selectedTileName =
    boardTiles.find((tile) => tile.isSelected)?.name || "";

  return {
    boardTiles,
    selectTile,
    deselectAllTiles,
    selectedTileName,
  };
}
