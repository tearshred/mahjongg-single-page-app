# Game Logic Flow

This document maps the structure and relationships of files inside the `game-logic` folder. It shows parent/child dependencies, function responsibilities, and how data flows between files.

## Folder Structure & File Responsibilities

game-logic/
├─ layout-builder.ts (Parent: generates tile coordinates & layer positions; Child: consumed by board-builder; Responsible for generating the raw board layout structure)
├─ board-builder.ts (Parent: receives layout from layout-builder; Child: consumed by React components; Responsible for mapping tiles to actual playable board data, including symbols/components)
├─ tile-types.ts (Parent: shared; Child: used by layout-builder, board-builder; Contains TypeScript types/interfaces for tiles and board positions)
├─ helpers.ts (Parent: utility; Child: used by layout-builder and board-builder; Contains reusable functions like matrix creation, bounds checking, shuffling, etc.)
├─ constants.ts (Parent: shared; Child: used by layout-builder, board-builder; Contains constants like DEFAULT_TURTLE_SHAPE, shrinkPerLayer, etc.)
├─ tests/
│ ├─ Layout.test.tsx (Parent: layout-builder; Child: none; Contains Vitest unit tests for verifying tile generation, layer correctness, and visual board matrices)
│ └─ Board.test.tsx (Parent: board-builder; Child: none; Contains Vitest unit tests for board mapping, symbol assignment, and playable tile state)

markdown
Copy code

## Data Flow Explanation

1. **layout-builder.ts**

   - Generates the raw tile coordinates for each layer (`row`, `col`, `layer`).
   - Does not include symbols or React component info.
   - Returns an array of `BoardPosition[]`.

2. **board-builder.ts**

   - Takes the output from layout-builder.
   - Maps coordinates to actual tile components (assigns symbols, IDs, state).
   - Prepares the board for React consumption in components.

3. **tile-types.ts**

   - Defines `BoardPosition`, `TileDataWithState`, and other type contracts.
   - Ensures type safety across layout-builder and board-builder.

4. **helpers.ts**

   - Functions like `createMatrix`, `mapTilesToMatrix`, or `shuffleArray`.
   - Keeps layout-builder and board-builder clean and focused.

5. **constants.ts**

   - Global constants for board shape, default shrinkage, max layers.
   - Used by layout-builder and tests to maintain consistency.

6. **Tests**
   - **Layout.test.tsx**: Validates layout generation (number of tiles, layer structure, visual matrices).
   - **Board.test.tsx**: Validates mapping to playable board, component readiness, symbol placement.

## Notes for Future Development

- Adding new board shapes only requires updating `constants.ts` and layout-builder logic.
- Adding symbols or tile states happens in board-builder, so layout-builder stays pure and decoupled.
- Tests are separated per layer of responsibility: generation vs mapping.
- Helpers can be expanded for matrix manipulations or new tile behaviors.
- Using `layerMatrices` allows console logging each layer independently for debugging or visual verification.

## Optional Visual Flow (ASCII)

layout-builder.ts (generates coordinates)
│
▼
board-builder.ts (maps coordinates to playable tiles)
│
▼
React Components (renders board)
│
▼
User Interaction / Game Logic

tile-types.ts ────┐
helpers.ts ───┤ used by layout-builder & board-builder
constants.ts ──┘

tests/
├─ Layout.test.tsx (tests layout-builder)
└─ Board.test.tsx (tests board-builder)
