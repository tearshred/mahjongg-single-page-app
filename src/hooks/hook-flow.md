1. useMahjonggTileData.ts
   - Purpose: Extract tile metadata from SVGs (name + path).
   - Output: Array of TileSymbol objects: [{ name, path, Component }]
   - Pure data hook — no state, no rendering.
   - Consumed by: useMahjonggBoard.ts (for initializing board tiles).

2. useMahjonggTileDesign.ts
   - Purpose: Load SVG files as React components.
   - Output: Object mapping SVG path → React component.
   - Pure rendering hook — no state.
   - Consumed by: TileDesign.tsx via props, or directly by Tile.tsx.

3. useMahjonggTileState.ts
   - Purpose: Manage per-tile UI state (e.g., isSelected, isClicked, isHighlighted).
   - Output: Functions and state objects: getTileState(name), setTileState(name, newState)
   - Consumed by: Tile.tsx (tile container) and useMahjonggBoard.ts (aggregate state).

4. useMahjonggBoard.ts
   - Purpose: Orchestrate the board.
       a) Fetch tile metadata from useMahjonggTileData
       b) Load SVG components from useMahjonggTileDesign
       c) Maintain state via useMahjonggTileState
       d) Pass props to Tile.tsx
   - Output: Array of tiles ready to render, each with:
       - name
       - Component
       - state (isSelected, isClicked)
       - event handlers (onClick, etc.)
   - Consumed by: Board.tsx component for rendering the full board.

5. Tile.tsx
   - Purpose: Tile container
       - Handles click events
       - Applies selection/highlight logic
       - Passes rendering props to TileDesign
   - Receives:
       - name
       - Component (from tileDesigns)
       - state (isSelected, etc.)
       - onClick handler
   - Consumed by: Board.tsx (iterates tiles array)

6. TileDesign.tsx
   - Purpose: Pure visual renderer
       - Only renders the SVG component
       - Accepts className and click handler for styling and interaction
   - Receives:
       - Component (SVG)
       - className
       - onClick
   - No state

## Hook relationship diagram

Board.tsx
  ├─> useMahjonggBoard.ts
        ├─> useMahjonggTileData.ts       (tile metadata: name, path)
        ├─> useMahjonggTileDesign.ts     (SVG components)
        └─> useMahjonggTileState.ts      (state management)
  └─> Tiles Array
        ├─> Tile.tsx
        │    ├─> TileDesign.tsx         (renders SVG)
        │    └─> handles click & state update
        └─> repeats for each tile
