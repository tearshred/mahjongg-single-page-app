export interface BoardPosition {
  // Create an emtpy array to store all tile poisitons
  layer: number;
  row: number;
  col: number;
}

const TURTLE_SHAPE = {
  maxLayers: 5,
  baseRows: 8,
  baseCols: 10,
};

export function generateTurtleLayout(): BoardPosition[] {
  // this variable is an array of BoardPosition objects
  // ` = [] ` - start it as an empty array
  const positions: BoardPosition[] = [];

  for (let layer = 0; layer < TURTLE_SHAPE.maxLayers; layer++) {
    // Each layer shrinks inward compared to the previous one
    const shrinkage = layer * 2;

    // Calculate the number of rows and columns for this layer after shrinkage
    const layerRows = TURTLE_SHAPE.baseRows - shrinkage * 2;
    const layerCols = TURTLE_SHAPE.baseCols - shrinkage * 2;

    // Only generate positions if this layer has positive dimensions
    if (layerRows > 0 && layerCols > 0) {
      // Loop through each row in this layer
      for (let row = 0; row < layerRows; row++) {
        // Loop through each column in this layer
        for (let col = 0; col < layerCols; col++) {
          // Push a new tile position to the positions array
          positions.push({
            layer: layer, // Z-axis: which stacked layer
            row: row + shrinkage, // Y-axis: offset by shrinkage to center
            col: col + shrinkage, // X-axis: offset by shrinkage to center
          });
          // Visual example:
          // Layer 0 (bottom): ██████████
          // Layer 1 (shrinkage=2):   ██████
          // Layer 2 (shrinkage=4):     ██
          // Each '█' corresponds to a position pushed to the array
        }
      }
    }
  }

  return positions;
}
