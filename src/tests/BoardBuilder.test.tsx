import { describe, it, expect } from "vitest";
import assignTilePositions from "../gameplay-features/game-logic/board-builder";
import type { TileDataWithState } from "../types/TileState";
import type { GridPosition } from "../types/BoardLayouts";

describe("Board Builder - Layer 0 Tests", () => {
    // Helper function to create mock tiles
    function createMockTiles(count: number): TileDataWithState[] {
        return Array.from({ length: count }, (_, i) => ({
            name: `tile${i}`,
            suit: "mock",
            value: `tile${i}`,
            position: {} as GridPosition,
            isSelected: false,
            isHighlighted: false,
            isClicked: false,
            path: `/mock/tile${i}.svg`,
            Component: () => null
        }));
    }

    it("correctly positions tiles in layer 0", () => {
        const mockTiles = createMockTiles(147);
        const assignedTiles = assignTilePositions(mockTiles);
        
        // Filter only layer 0 tiles
        const layer0Tiles = assignedTiles.filter(tile => tile.position.layer === 0);
        
        // Create a visual representation of the bottom layer
        const maxRow = Math.max(...layer0Tiles.map(t => t.position.gridRow));
        const maxCol = Math.max(...layer0Tiles.map(t => t.position.gridColumn));
        
        // Create empty grid
        const grid: string[][] = Array.from({ length: maxRow }, () => 
            Array.from({ length: maxCol }, () => '  '));

        // Place tiles in grid
        layer0Tiles.forEach(tile => {
            const row = tile.position.gridRow - 1;  // Convert to 0-based for array
            const col = tile.position.gridColumn - 1;
            grid[row][col] = '🀄';  // Use mahjong tile emoji for visualization
        });

        // Convert grid to table format with row/column indicators
        const tableData = grid.map((row, rowIndex) => {
            const rowObj: Record<string, string> = { row: (rowIndex + 1).toString() };
            row.forEach((cell, colIndex) => {
                rowObj[`col${colIndex + 1}`] = cell || '  ';
            });
            return rowObj;
        });

        // Display layout summary
        console.table({
            totalTiles: layer0Tiles.length,
            rows: maxRow,
            columns: maxCol
        });

        // Display the grid as a table
        console.log('\nLayer 0 Grid Layout:');
        console.table(tableData);

        // Verify layer 0 properties
        expect(layer0Tiles.length).toBeGreaterThan(0);
        expect(Math.min(...layer0Tiles.map(t => t.position.layer))).toBe(0);
        expect(Math.max(...layer0Tiles.map(t => t.position.layer))).toBe(0);
        
        // Verify tiles are properly positioned
        layer0Tiles.forEach(tile => {
            expect(tile.position.gridRow).toBeGreaterThan(0);
            expect(tile.position.gridColumn).toBeGreaterThan(0);
            expect(tile.position.layer).toBe(0);
    });
});
});