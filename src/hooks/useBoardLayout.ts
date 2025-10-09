import { useMemo } from "react"; // For memoizing layout computations
import type {
  LayoutPosition,
  LayoutName,
  BoardLayoutOptions,
} from "../types/BoardLayouts";
import { turtleLayout } from "../gameplay-features/layouts/turtle-layout"; // Default layout function

export function useBoardLayout({
  // This is destructuring from the function parameter.
  // If no layout is provided, it defaults to "turtle".
  layout = "turtle",
   // = {} provides a default empty object, so the function can be called with no arguments.
   // LayoutPosition[] - declares a return type: an array of TilePosition objects
}: BoardLayoutOptions = {}): LayoutPosition[] {
    // useMemo caches the result of the function, making it accessible throughout the app
  const positions = useMemo<LayoutPosition[]>(() => {
    switch (layout as LayoutName) {
      case "turtle":
      default:
        return turtleLayout();
    }
     // [] - the function only recomputes if the dependency changes, in this case `layout`
  }, [layout]);

  return positions;
}
