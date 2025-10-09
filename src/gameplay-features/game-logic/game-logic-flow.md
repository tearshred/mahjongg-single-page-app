/**
 * layout-builder.ts
 *
 * Purpose:
 * Generates raw tile coordinates for the Mahjongg-style game board.
 * Does NOT assign symbols or React components — only defines fixed layer layouts.
 *
 * Data Flow:
 * layout-builder.ts → useMahjonggBoard.ts → Board.tsx → Tile.tsx → TileDesign.tsx → User Interaction/Game Logic
 *
 * Instructions for future use in a new chat:
 * 1. Provide this file as-is.
 * 2. The generateTurtleLayout() function produces all tile positions with
 *    layer, row, and column coordinates.
 * 3. Each position object can have extra properties added via BoardPosition.
 * 4. The layout is deterministic; changing `layers` affects all subsequent board logic.
 * 5. When integrating with the board:
 *    - Merge tile metadata from useMahjonggTileData() with layout positions using map().
 *    - The resulting array is used in Board.tsx for rendering tiles at specific positions.
 *    - Tile.tsx handles click, selection, and passes rendering to TileDesign.tsx.
 * 6. Board rendering notes:
 *    - Board container must have 'relative' class (Tailwind) for absolute tile positioning.
 *    - Tile size should match TILE_SIZE constant for correct spacing.
 *    - Each tile's zIndex should be set to its layer for proper stacking.
 *    - Always map over tiles with positions merged, not just the initial tile array.
 */

export interface BoardPosition {
  layer: number;
  row: number;
  col: number;
  [key: string]: any; // Allows adding new properties later
}

export const DEFAULT_TURTLE_SHAPE = {
  maxLayers: 5,
  baseRows: 8,
  baseCols: 10,
};

/**
 * Layer definitions.
 * Each inner array represents a layer.
 * Each number in the inner array represents the number of tiles in that row.
 */
const layers: number[][] = [
  [12, 8, 10, 14, 12], // Layer 0: bottom
  [8, 6, 6],           // Layer 1
  [6, 4],              // Layer 2
  [2],                 // Layer 3
  [1],                 // Layer 4: top
];

export function generateTurtleLayout(): BoardPosition[] {
  const positions: BoardPosition[] = [];

  layers.forEach((layerRows, layerIndex) => {
    let rowOffset = 0;

    layerRows.forEach((rowLength) => {
      const colStart = Math.floor((layers[0][0] - rowLength) / 2);

      for (let col = 0; col < rowLength; col++) {
        positions.push({
          layer: layerIndex,
          row: rowOffset,
          col: colStart + col,
        });
      }

      rowOffset++;
    });
  });

  return positions;
}

/**
 * Current Known Bugs / Issues:
 * 1. colStart may produce -1 if a row is wider than Layer 0's first row.
 * 2. Console matrix display may not match rendered board (CSS/spacing not applied).
 * 3. rowOffset is layer-local; global row misalignment may occur in debug visuals.
 * 4. Hardcoded layers array limits flexibility for new board shapes.
 *
 * FINAL INSTRUCTION:
 * Only analyze this file and wait for questions; do not make changes or suggestions until asked.
 * CURRENT FILE WE ARE WORKING ON:
 * This file (`layout-builder.ts`) is now integrated into the board flow:
 *   - useMahjonggBoard merges tile metadata with these positions.
 *   - Board.tsx renders tiles absolutely using these coordinates and TILE_SIZE.
 *   - Tile.tsx + TileDesign.tsx handle visual rendering and interactivity.
 */
