Mahjongg Board Debug Prompt

I’m building a Mahjongg game in React + TypeScript. I need help rendering the board layout correctly with random tiles, proper CSS Grid placement, and selectable tiles.

Goals

Display Layer 0 first, then stack all layers with correct z-index.

Tiles must align perfectly with the grid.

Tile symbols (TileDesign) overlay TileBase correctly.

Tiles are selectable (isSelected) without regenerating the board.

Each layout cell displays a random tile for testing.

Key Files

Board.tsx – Renders the board, maps TileDataWithState to Tile components.

Tile.tsx – Renders TileBase + TileDesign, handles clicks.

TileDesign.tsx – Displays the correct symbol for a tile.

useMahjonggBoard.ts – Hook managing board state, tile positions, and selection.

useMahjonggTileData.ts – Provides tile metadata.

layout-builder.ts – Generates turtle layout positions.

layoutMapper.ts – Computes CSS Grid positions and row centering.

tileRandomizer.ts – Assigns random tiles to positions.

boardHelper.ts – Filters tiles by layer and computes grid size.

Relationships

Board.tsx → uses useMahjonggBoard() + Tile.tsx

Tile.tsx → uses TileDesign.tsx

useMahjonggBoard.ts → uses useMahjonggTileData(), generateTurtleLayout(), layoutMapper.ts, tileRandomizer.ts