import { useState } from "react";
import { useMahjonggTileData } from "./useMahjonggTileData";
import type { TileDataWithState } from "../types/TileState";

export function useMahjonggBoard() {
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

  const [boardTiles, setBoardTiles] = useState<TileDataWithState[]>(initialTileState);

  return {boardTiles, setBoardTiles};
}
