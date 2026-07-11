import Phaser from "phaser";
import { getTilePlacement, TILE_HEIGHT, TILE_WIDTH } from "../../utils/tilePlacement";
import type { TileDataWithState } from "../../types/tile-meta";

/**
 * Phaser Game Scene for Mahjong Board Rendering
 * 
 * This scene handles:
 * - Tile sprite creation from game state
 * - Interactive tile clicks and selection
 * - 3D isometric rendering via sprites and layering
 * - Animations and visual feedback
 */
export default class MahjongGameScene extends Phaser.Scene {
  private tiles: Map<string, Phaser.GameObjects.Container> = new Map();
  private onTileSelect?: (tile: TileDataWithState) => void;
  private boardPaddingLeft: number = 0;
  private boardPaddingTop: number = 0;
  private static readonly FACE_OFFSET = 6;

  constructor() {
    super({ key: "MahjongGameScene" });
  }

  preload() {
    // No external spritesheet is loaded yet.
    // Tiles fall back to generated canvas textures so labels remain visible.
  }

  create() {
    // Initialize the scene
    this.cameras.main.setBackgroundColor("#2a2a2a");
    this.input.enabled = true;
    
    // Calculate board padding (same logic as React Board.tsx)
    const maxLayer = 4;
    this.boardPaddingLeft = 4 * (maxLayer + 1) + 10;
    this.boardPaddingTop = 5 * (maxLayer + 1) + 12;
  }

  update() {
    // Optional: Handle frame-by-frame updates (animations, etc.)
  }

  /**
   * Render tiles from the board state array
   * Called from React when game state updates
   */
  public renderBoard(tiles: TileDataWithState[], onSelectTile: (tile: TileDataWithState) => void) {
    this.onTileSelect = onSelectTile;

    // Clear existing sprites
    this.tiles.forEach((sprite) => sprite.destroy());
    this.tiles.clear();

    // Render each tile as a sprite
    tiles.forEach((tile) => {
      this.renderTile(tile);
    });
  }

  /**
   * Render a single tile as a sprite
   */
  private renderTile(tile: TileDataWithState) {
    const tilePlacement = getTilePlacement(tile.position);
    
    // Calculate final position
    const finalX = this.boardPaddingLeft + tilePlacement.left;
    const finalY = this.boardPaddingTop + tilePlacement.top;

    // Create tile sprite group (backing + faceplate)
    const tileKey = `${tile.name}-${tile.position.layer}-${tile.position.row}-${tile.position.col}`;
    
    // Create a container to hold both backing and faceplate
    const container = this.add.container(finalX, finalY);
    container.setDepth(tilePlacement.zIndex);

    // Backing layer (green #0F5132)
    const backing = this.add.graphics();
    backing.fillStyle(0x0f5132, 1);
    backing.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    backing.lineStyle(1, 0x0b3d26, 1);
    backing.strokeRect(0.5, 0.5, TILE_WIDTH - 1, TILE_HEIGHT - 1);
    container.add(backing);

    // Faceplate layer (offset NW) uses a cached canvas texture with label text.
    const faceplate = this.add.image(
      -MahjongGameScene.FACE_OFFSET,
      -MahjongGameScene.FACE_OFFSET,
      this.getOrCreateTileTexture(tile)
    );
    faceplate.setOrigin(0, 0);
    container.add(faceplate);

    // Make the tile interactive
    const hitArea = new Phaser.Geom.Rectangle(
      -MahjongGameScene.FACE_OFFSET,
      -MahjongGameScene.FACE_OFFSET,
      TILE_WIDTH + MahjongGameScene.FACE_OFFSET,
      TILE_HEIGHT + MahjongGameScene.FACE_OFFSET
    );
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // Handle tile click
    container.on("pointerdown", () => {
      this.onTileSelect?.(tile);
    });

    // Store reference
    this.tiles.set(tileKey, container);
  }

  private getOrCreateTileTexture(tile: TileDataWithState): string {
    const textureKey = `tile-face-${tile.name}-${tile.isSelected ? "selected" : "default"}`;

    if (this.textures.exists(textureKey)) {
      return textureKey;
    }

    const texture = this.textures.createCanvas(textureKey, TILE_WIDTH, TILE_HEIGHT);
    if (!texture) {
      throw new Error(`Failed to create tile texture: ${textureKey}`);
    }
    const context = texture.getContext();

    context.clearRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    context.fillStyle = "#F4EAD4";
    context.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);

    context.lineWidth = 2;
    context.strokeStyle = "#0F5132";
    context.strokeRect(1, 1, TILE_WIDTH - 2, TILE_HEIGHT - 2);

    context.fillStyle = "#0F5132";
    context.font = "bold 15px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    const lines = this.formatTileLabel(tile.name);
    lines.forEach((line, index) => {
      const lineHeight = 18;
      const startY = TILE_HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2;
      context.fillText(line, TILE_WIDTH / 2, startY + index * lineHeight);
    });

    if (tile.isSelected) {
      context.fillStyle = "rgba(245, 158, 11, 0.18)";
      context.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
      context.lineWidth = 3;
      context.strokeStyle = "#D97706";
      context.strokeRect(1.5, 1.5, TILE_WIDTH - 3, TILE_HEIGHT - 3);
    }

    texture.refresh();
    return textureKey;
  }

  private formatTileLabel(name: string): string[] {
    const compactName = name.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
    const parts = compactName.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return [parts[0]];
    }

    if (parts.length === 2) {
      return [parts[0], parts[1]];
    }

    return [parts.slice(0, -1).join(" "), parts.at(-1) ?? ""];
  }

  /**
   * Update tile visual state (for matches, etc.)
   */
  public updateTileState(tile: TileDataWithState) {
    const tileKey = `${tile.name}-${tile.position.layer}-${tile.position.row}-${tile.position.col}`;
    const sprite = this.tiles.get(tileKey);
    
    if (sprite) {
      // Update visual state (opacity for matched tiles, etc.)
      if (tile.isMatched) {
        sprite.setAlpha(0.5);
      } else {
        sprite.setAlpha(1);
      }
    }
  }

  /**
   * Remove a tile from the scene
   */
  public removeTile(tile: TileDataWithState) {
    const tileKey = `${tile.name}-${tile.position.layer}-${tile.position.row}-${tile.position.col}`;
    const sprite = this.tiles.get(tileKey);
    
    if (sprite) {
      sprite.destroy();
      this.tiles.delete(tileKey);
    }
  }
}
