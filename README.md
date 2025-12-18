# Mahjong Single Page Application

A modern implementation of the classic Mahjong Solitaire game built with React, TypeScript, and Vite.

## Project Structure

```
src/
├── components/         # React components
│   ├── Board.tsx      # Main game board
│   ├── Tile.tsx       # Individual tile component
│   └── ...
├── gameplay-features/ # Core game logic
│   ├── game-logic/    # Game mechanics
│   │   ├── board-builder.ts
│   │   └── layout-builder.ts
│   └── layouts/       # Board layouts
│       └── turtle-layout.ts
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Grid System

The game uses a sophisticated grid system for tile placement:

- Grid Range: 0-14 (15 columns total)
- Regular Tiles: Positions 1-12 (centered)
- Floating Tiles:
  - Position 0: Left floating tile
  - Positions 13-14: Right floating tiles

### Layout Structure

Each row in the layout is defined by:
- Number of regular tiles (centered in positions 1-12)
- Optional floating tiles:
  - Left position (0)
  - Right positions (13-14)

## Development

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (preferred package manager)

### Setup

1. Clone the repository
```bash
git clone [repository-url]
cd mahjongg-single-page-app
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm dev
```

## Technical Implementation

### Key Features

- Type-safe layout generation
- Automatic tile centering
- CSS Grid-based positioning
- React hooks for state management
- Custom coordinate system for tile placement

### Core Components

- **Board**: Main game container with CSS Grid layout
- **Tile**: Individual Mahjong tile with click handling
- **Layout Builder**: Generates tile positions and handles centering
- **Board Builder**: Converts layouts to grid positions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```
