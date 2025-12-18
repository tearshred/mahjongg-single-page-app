import { generateTurtleLayout } from "./layout-builder";
import type { TileDataWithState } from "../../types/tile-meta";
import type { LayoutPosition } from "../../types/BoardLayouts";
import type { GridPosition } from "../../types/BoardLayouts";
import { computeGridPosition } from "../../utils/layoutMapper";

// Helper function to convert LayoutPosition to GridPosition using proper centering logic
function convertToGridPosition(pos: LayoutPosition): GridPosition {
    
    return {
        ...computeGridPosition(pos),
        floating: pos.floating ?? 'none',
    };
}

export default function assignTilePositions(tiles: TileDataWithState[]): TileDataWithState[] {
    // Get all positions from the layout
    const positions = generateTurtleLayout();
    
    // Validate we have enough tiles for positions
    if (tiles.length < positions.length) {
        throw new Error(`Not enough tiles for layout. Need ${positions.length}, have ${tiles.length}`);
    }

    // Group positions by layer for better organization
    const positionsByLayer = positions.reduce((acc, pos) => {
        if (!acc[pos.layer]) {
            acc[pos.layer] = [];
        }
        acc[pos.layer].push(pos);
        return acc;
    }, {} as Record<number, LayoutPosition[]>);

    // Assign tiles to positions layer by layer
    let tileIndex = 0;
    const assignedTiles: TileDataWithState[] = [];

    // Process each layer in order
    Object.keys(positionsByLayer)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach(layer => {
            const layerPositions = positionsByLayer[layer];
            layerPositions.forEach(position => {
                const tile = tiles[tileIndex];
                assignedTiles.push({
                    ...tile,
                    position: convertToGridPosition(position),
                    isSelected: false,
                    isHighlighted: false,
                    isClicked: false,
                    value: tile.name,
                    floating: position.floating ?? 'none'
                });
                tileIndex++;
            });
        });

    return assignedTiles;
}
