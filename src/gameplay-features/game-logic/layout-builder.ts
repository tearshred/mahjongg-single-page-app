export interface BoardPosition {
  // Create an emtpy array to store all tile poisitons
  layer: number;
  row: number;
  col: number;
  [key: string]: any; // Allows adding new properties later
}

const DEFAULT_TURTLE_SHAPE = {
  maxLayers: 5,
  baseRows: 8,
  baseCols: 10,
};

export function generateTurtleLayout(
  // Use provided shape or default board dimensions
  boardShape: typeof DEFAULT_TURTLE_SHAPE = DEFAULT_TURTLE_SHAPE,
  // How much each layer shrinks inward compared to the layer below
  shrinkPerLayer: number = 2
): BoardPosition[] {
  // this variable is an array of BoardPosition objects
  // ` = [] ` - start it as an empty array
  const positions: BoardPosition[] = [];

  // Define row lengths for each layer (example for 5 layers)
  const layers: number[][] = [
    [12, 8, 10, 14, 12], // Layer 0: bottom, each number = tiles in that row
    [8, 6, 6],           // Layer 1
    [6, 4],              // Layer 2
    [2],                 // Layer 3
    [1],                 // Layer 4: top tile
  ];

  layers.forEach((layerRows, layerIndex) => {
    let rowOffset = 0; // Tracks current row in matrix
    layerRows.forEach((rowLength) => {
      // Center the row: calculate starting column
      const colStart = Math.floor((layers[0][0] - rowLength) / 2);

      for (let col = 0; col < rowLength; col++) {
        positions.push({
          layer: layerIndex,
          row: rowOffset,
          col: colStart + col,
        });
      }

      rowOffset++;
    });
  });

  return positions;
}
