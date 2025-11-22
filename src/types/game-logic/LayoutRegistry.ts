import type { LayoutPosition } from "../BoardLayouts";
import * as layouts from "../../gameplay-features/layouts"

// Registry of all available layouts in the game

export const LAYOUT_NAMES = {
    TURTLE: "turtle",
    // DRAGON: "dragon", // future layout, TBD
} as const;

// typeof gets the "type" of something - typeof LAYOUT_NAMES: "an object with LAYOUT_NAME (turtle) properties"
// keyof gets all the property "names" (keys) from a type.
// typeof - describing what the object looks like
// keyof - gets all the property names from a type
export type LayoutName = typeof LAYOUT_NAMES[keyof typeof LAYOUT_NAMES];

// Set default layout to turtle
export const DEFAULT_LAYOUT = LAYOUT_NAMES.TURTLE;

// Registry mapping layout names to their 3D grid generator functions
export const LAYOUT_GENERATORS = {
    [LAYOUT_NAMES.TURTLE]: layouts.turtleLayout,
    // Future: [LAYOUT_NAMES.DRAGON]: layouts.dragonLayout,
} as const;

export const LAYOUT_METADATA = {
    [LAYOUT_NAMES.TURTLE]: layouts.turtleMetadata,
    // Future: [LAYOUT_NAMES.DRAGON]: layouts.dragonMetadata
}

// Why as const?
// as const tells TypeScript: "This object won't change, and keep the exact types"
// Without it, TypeScript might think the values are just "any function"
// With it, TypeScript knows: "layouts.turtleLayout is specifically the turtle layout function"

// This interface defines the blueprint that says "All layout configurations must have these properties"
export interface LayoutConfig {
  gridDimensions: { rows: number; columns: number };
  layerCount: number;
  // Array of all tile positions in the layout (e.g., 144 for turtle)
  positions: LayoutPosition[];
  // Which layers should be displayed (e.g., [0,1,2,3,4] for all layers, etc)
  renderConfig: { layersToRender: number[] };
}