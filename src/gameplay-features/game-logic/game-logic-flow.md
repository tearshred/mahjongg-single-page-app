/**
 * layout-builder.ts
 *
 * Purpose:
 * Generates raw tile coordinates for the Mahjongg-style game board.
 * Does NOT assign symbols or React components — only defines fixed layer layouts.
 *
 * Data Flow:
 * layout-builder.ts → board-builder → useMahjonggBoard.ts → Board.tsx → Tile.tsx → TileDesign.tsx → User Interaction/Game Logic
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


