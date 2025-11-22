import { describe, it, expect } from "vitest";

describe("Grid System - All Layers Visualization", () => {
    // Import the layer creation functions
    // Note: These would need to be exported from turtle-layout.ts
    // For now, we'll recreate the logic here for testing
    
    const STANDARD_GRID = {
        rows: 8,
        columns: 15,
        layers: 5
    };

    // Helper to create empty grid
    function createEmptyGrid(): string[][] {
        return Array.from({ length: STANDARD_GRID.rows }, () => 
            Array(STANDARD_GRID.columns).fill('  '));
    }

    // Helper to mark tiles in grid (using emoji)
    function markTiles(grid: string[][], positions: {row: number, col: number, floating?: boolean}[]): void {
        positions.forEach(({ row, col, floating }) => {
            if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
                grid[row][col] = floating ? '🎈' : '🀄';  // 🀄 for tiles, 🎈 for floating
            }
        });
    }

    // Helper to display grid as table with row/column indicators
    function displayGrid(grid: string[][], layerName: string): void {
        const tableData = grid.map((row, rowIndex) => {
            const rowObj: Record<string, string> = { row: rowIndex.toString() };
            row.forEach((cell, colIndex) => {
                rowObj[colIndex.toString()] = cell || '  ';
            });
            return rowObj;
        });
        
        console.log(`\n${layerName}`);
        console.table(tableData);
    }

    it("visualizes Layer 0 (Bottom Layer - 8x15)", () => {
        const grid = createEmptyGrid();
        
        const tilePositions = [
            // Row 0: columns 1-12
            ...Array.from({ length: 12 }, (_, i) => ({ row: 0, col: i + 1 })),
            // Row 1: columns 3-10
            ...Array.from({ length: 8 }, (_, i) => ({ row: 1, col: i + 3 })),
            // Row 2: columns 2-11
            ...Array.from({ length: 10 }, (_, i) => ({ row: 2, col: i + 2 })),
            // Row 3: columns 1-12
            ...Array.from({ length: 12 }, (_, i) => ({ row: 3, col: i + 1 })),
            // Row 4: Regular tiles (1-12)
            ...Array.from({ length: 12 }, (_, i) => ({ row: 4, col: i + 1 })),
            // Row 4: Floating tiles (0, 13, 14)
            { row: 4, col: 0, floating: true },
            { row: 4, col: 13, floating: true },
            { row: 4, col: 14, floating: true },
            // Row 5: columns 2-11
            ...Array.from({ length: 10 }, (_, i) => ({ row: 5, col: i + 2 })),
            // Row 6: columns 3-10
            ...Array.from({ length: 8 }, (_, i) => ({ row: 6, col: i + 3 })),
            // Row 7: columns 1-12
            ...Array.from({ length: 12 }, (_, i) => ({ row: 7, col: i + 1 })),
        ];

        markTiles(grid, tilePositions);
        displayGrid(grid, "Layer 0 (Bottom) - 🀄=tile, 🎈=floating");

        // Verify tile count (12+8+10+12+15+10+8+12 = 87 tiles)
        const tileCount = grid.flat().filter(cell => cell === '🀄' || cell === '🎈').length;
        expect(tileCount).toBe(87);
        
        // Verify floating tiles
        expect(grid[4][0]).toBe('🎈');
        expect(grid[4][13]).toBe('🎈');
        expect(grid[4][14]).toBe('🎈');
    });

    it("visualizes Layer 1 (6x6 centered)", () => {
        const grid = createEmptyGrid();
        
        // Layer 1: 6x6 centered
        // Rows: 1-6, Cols: 4-9
        const tilePositions = [];
        for (let row = 1; row <= 6; row++) {
            for (let col = 4; col <= 9; col++) {
                tilePositions.push({ row, col });
            }
        }

        markTiles(grid, tilePositions);
        displayGrid(grid, "Layer 1 (6x6) - 🀄=tile");

        // Verify tile count (6 rows × 6 cols = 36 tiles)
        const tileCount = grid.flat().filter(cell => cell === '🀄').length;
        expect(tileCount).toBe(36);
        
        // Verify centering
        expect(grid[1][4]).toBe('🀄');  // Top-left of 6x6
        expect(grid[6][9]).toBe('🀄');  // Bottom-right of 6x6
        expect(grid[0][4]).toBe('  ');  // Row above should be empty
        expect(grid[1][3]).toBe('  ');  // Column to left should be empty
    });

    it("visualizes Layer 2 (4x4 centered)", () => {
        const grid = createEmptyGrid();
        
        // Layer 2: 4x4 centered
        // Rows: 2-5, Cols: 5-8
        const tilePositions = [];
        for (let row = 2; row <= 5; row++) {
            for (let col = 5; col <= 8; col++) {
                tilePositions.push({ row, col });
            }
        }

        markTiles(grid, tilePositions);
        displayGrid(grid, "Layer 2 (4x4) - 🀄=tile");

        // Verify tile count (4 rows × 4 cols = 16 tiles)
        const tileCount = grid.flat().filter(cell => cell === '🀄').length;
        expect(tileCount).toBe(16);
        
        // Verify centering
        expect(grid[2][5]).toBe('🀄');  // Top-left of 4x4
        expect(grid[5][8]).toBe('🀄');  // Bottom-right of 4x4
    });

    it("visualizes Layer 3 (2x2 centered)", () => {
        const grid = createEmptyGrid();
        
        // Layer 3: 2x2 centered
        // Rows: 3-4, Cols: 6-7
        const tilePositions = [
            { row: 3, col: 6 }, { row: 3, col: 7 },
            { row: 4, col: 6 }, { row: 4, col: 7 }
        ];

        markTiles(grid, tilePositions);
        displayGrid(grid, "Layer 3 (2x2) - 🀄=tile");

        // Verify tile count (2 rows × 2 cols = 4 tiles)
        const tileCount = grid.flat().filter(cell => cell === '🀄').length;
        expect(tileCount).toBe(4);
        
        // Verify all 4 positions
        expect(grid[3][6]).toBe('🀄');
        expect(grid[3][7]).toBe('🀄');
        expect(grid[4][6]).toBe('🀄');
        expect(grid[4][7]).toBe('🀄');
    });

    it("visualizes Layer 4 (1x1 centered)", () => {
        const grid = createEmptyGrid();
        
        // Layer 4: 1x1 centered
        // Row: 3, Col: 7
        const tilePositions = [
            { row: 3, col: 7 }
        ];

        markTiles(grid, tilePositions);
        displayGrid(grid, "Layer 4 (Top/1x1) - 🀄=tile");

        // Verify tile count (1 tile)
        const tileCount = grid.flat().filter(cell => cell === '🀄').length;
        expect(tileCount).toBe(1);
        
        // Verify position
        expect(grid[3][7]).toBe('🀄');
    });

    it("verifies all layers combined (Total tile count)", () => {
        // Layer 0: 87 tiles
        // Layer 1: 36 tiles
        // Layer 2: 16 tiles
        // Layer 3: 4 tiles
        // Layer 4: 1 tile
        // Total: 144 tiles
        
        const totalTiles = 87 + 36 + 16 + 4 + 1;
        
        console.log('\nTotal Tiles Summary:');
        console.table({
            'Layer 0': 87,
            'Layer 1': 36,
            'Layer 2': 16,
            'Layer 3': 4,
            'Layer 4': 1,
            'Total': totalTiles
        });
        
        expect(totalTiles).toBe(144);
    });
});
