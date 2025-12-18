# useMahjonggBoard.ts

## Purpose
Manages the full Mahjongg board state and integrates tile metadata, layout positions, and tile UI state.  
Responsible for providing **Board.tsx** with tiles ready to render, each with their visual position, state, and event handlers.

---

## Data Flow
useMahjonggTileData.ts → useMahjonggBoard.ts → Board.tsx → Tile.tsx → TileDesign.tsx → User Interaction / Game Logic


- **useMahjonggTileData.ts**: Provides raw tile metadata (name, path, optional value, SVG component reference).  
- **generateTurtleLayout()** (from layout-builder.ts): Provides deterministic positions (layer, row, col) for all tiles.  
- **TileDataWithState**: Combines metadata + UI state + board position.  
- **Board.tsx**: Iterates over positioned tiles and renders each Tile.  
- **Tile.tsx**: Handles click events, selection logic, and passes rendering props to TileDesign.  
- **TileDesign.tsx**: Pure visual component, renders the SVG for each tile.

---

## Functionality / Responsibilities

1. **Load tile metadata**  
   - Uses `useMahjonggTileData()` to fetch all tile symbols and metadata.  

2. **Generate tile layout**  
   - Calls `generateTurtleLayout()` to create an array of `BoardPosition` objects.  

3. **Merge metadata with layout positions**  
   - Uses `.map()` to combine metadata with positions:
     ```ts
     const positionedTiles: TileDataWithState[] = initialTileState.map((tile, index) => ({
       ...tile,
       position: positions[index],
     }));
     ```  

4. **Manage per-tile UI state**  
   - `isSelected`, `isClicked`, `isHighlighted` flags for interactions.  
   - Functions:
     - `selectTile(tileName: string)` → sets only that tile as selected.  
     - `deselectAllTiles()` → clears all selections.  

5. **Expose board API for Board.tsx**  
   - `boardTiles` → fully prepared array of tiles with metadata, position, and state.  
   - `selectedTileName` → string for currently selected tile.  
   - `selectTile()` / `deselectAllTiles()` → event handlers for parent.  

---

## Rendering Notes for Board.tsx

- **Container styling**
  - Use `relative` on parent container for `absolute` positioning of tiles.  
- **Tile sizing**
  - Ensure each tile has a fixed size (`TILE_SIZE`) matching layout calculations.  
- **Absolute positioning**
  - `top = row * TILE_SIZE`, `left = col * TILE_SIZE`, `zIndex = layer`.  
- **Iteration**
  - Use `.map()` over `boardTiles` (not `tileData`) to render with positions and state.  
- **Debugging**
  - Insert `console.log(boardTiles)` to inspect merged metadata + position before rendering.  

---

## Tips / Clues for Future Development

- You can add extra properties to `TileDataWithState` (e.g., `isMatched`, `animationState`) without modifying the layout.  
- Always use the **merged positioned array** for rendering — otherwise tiles will stack or misalign.  
- Remember Tailwind sizing + absolute positioning must match your `TILE_SIZE` constant.  
- Hooks are composable: if new tile types are added, update `useMahjonggTileData` first, then the merge in this hook.  

---

## Current File State

- `useMahjonggBoard.ts` now:
  - Loads tiles from metadata hook.
  - Generates deterministic layout positions.
  - Merges metadata with positions into `TileDataWithState[]`.
  - Maintains per-tile state (`isSelected`, `isClicked`, `isHighlighted`).
  - Exposes API for rendering and user interaction in Board.tsx.
