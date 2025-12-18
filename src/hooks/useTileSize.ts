import { useState, useRef, useLayoutEffect } from "react";
import type { TileSize } from "../types/tile-meta";

/**
 * Custom hook to dynamically measure the size of a tile element.
 * This is necessary for floating tiles that sit between grid rows,
 * so we can calculate pixel-perfect top/left offsets instead of using hardcoded values.
 */
export function useTileSize(): {
  tileRef: React.RefObject<HTMLDivElement | null>; // Reference to the DOM element
  tileSize: TileSize; // Stores width and height
} {
  // Creating a ref to attach to a tile element
  // This allows us to access the actual DOM node after it renders
  // useRef maintains the same reference across renders
  // Initialized with null because the element doesn’t exist yet
  // The returned object has a `.current` property
  const tileRef = useRef<HTMLDivElement | null>(null);

  // Store tile size
  const [tileSize, setTileSize] = useState<TileSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    // Synchronously measure before paint to avoid layout jank
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      setTileSize({ width: rect.width, height: rect.height });
    }
  }, []);

  // `tileRef` → attach to a tile div in Board.tsx
  // `tileSize` → use for calculating top/left offsets for floating tiles
  return { tileRef, tileSize };
}
