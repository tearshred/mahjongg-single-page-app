import type { TileDataWithState } from "./tile-meta";

export interface BoardProps {
  tiles: TileDataWithState[];
  // Record<string, string | number> → TypeScript utility type.
  values?: Record<string, string | number>;

  // Optional callback when a tile is clicked
  onTileClick?: (tileName: string) => void;

  // Optional callback for hovering over a tile
  onTileHover?: (tileName: string) => void;

  // Optional flags for gameplay rules or styling
  allowMultiSelect?: boolean; // Can multiple tiles be selected at once?
  highlightMatches?: boolean; // Automatically highlight matching tiles
  className?: string; // Additional styling for the board container
}
