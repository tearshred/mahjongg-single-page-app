import { useState } from "react";
import { useMahjonggTileData } from "./useMahjonggTileData";
import type { TileDataWithState } from "../types/TileState";
import type { MahjonggBoardAPI } from "../types/BoardAPI";
import { generateTurtleLayout } from "../gameplay-features/game-logic/layout-builder";
import { computeVirtualGrids, getRowTileCount, computeGridPosition } from "../utils/layoutMapper";

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
    isHighlighted: false, // optional UI state
    value: tile.value ?? tile.name, // fallback in case value is undefined
  }));

  // Generate the backend layout positions (row, col, layer)
  const positions = generateTurtleLayout();
  // Compute virtual grids for each layer
  //    - This defines the invisible grid structure per layer
  const virtualGrids = computeVirtualGrids(positions);

  // 5. Merge tile metadata with backend positions AND compute CSS Grid coordinates
const positionedTiles: TileDataWithState[] = initialTileState.map((tile, index) => {
  const backendPos = positions[index];                     // row/col/layer from backend
  const layerGrid = virtualGrids[backendPos.layer];        // virtual grid for this tile's layer
  const rowTileCount = getRowTileCount(positions, backendPos.layer, backendPos.row); // tiles in this row

  // Combine backend coordinates with CSS Grid coordinates
  const gridPos = computeGridPosition(backendPos, rowTileCount, layerGrid);

  // Functionally, the tile now carries both backend reference coordinates and 
  // frontend grid coordinates, making the system future-proof and responsive.
  return {
    ...tile,
    position: {
      ...backendPos, // keeps {row, col, layer} for TileDataWithState
      ...gridPos,    // adds {gridRow, gridColumn} for CSS Grid
    },
  };
});

  const [boardTiles, setBoardTiles] =
    useState<TileDataWithState[]>(positionedTiles);

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
