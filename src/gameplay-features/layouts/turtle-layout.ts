// Define a more meaningful type for clarity
export type LayerRows = number[];      // One layer = array of row lengths
export type LayoutShape = LayerRows[]; // Full board = array of layers

export const turtleLayout = (): LayoutShape => {
  return [
    [12, 8, 10, 14, 12], // Layer 0
    [6, 6, 6, 6, 6, 6],  // Layer 1
    [4, 4, 4, 4],        // Layer 2
    [2, 2],              // Layer 3
    [1],                 // Layer 4
  ];
};