import { useEffect, useRef } from "react";
import Phaser from "phaser";
import MahjongGameScene from "../gameplay-features/phaser/MahjongGameScene";
import type { TileDataWithState } from "../types/tile-meta";

interface PhaserBoardProps {
  tiles: TileDataWithState[];
  onSelectTile: (tile: TileDataWithState) => void;
}

/**
 * Phaser Board Container
 * 
 * Wraps the Phaser game instance and provides React integration
 * Handles initialization, updates, and cleanup of the Phaser canvas
 */
export const PhaserBoard: React.FC<PhaserBoardProps> = ({ tiles, onSelectTile }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<MahjongGameScene | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Phaser game on mount
  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "phaser-game-container",
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#2a2a2a",
      scene: MahjongGameScene,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Get scene reference once created
    const handleSceneCreate = () => {
      sceneRef.current = game.scene.getScene("MahjongGameScene") as MahjongGameScene;
      if (sceneRef.current && tiles.length > 0) {
        sceneRef.current.renderBoard(tiles, onSelectTile);
      }
    };

    game.events.once("ready", handleSceneCreate);

    // Handle window resize
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Update board when tiles change
  useEffect(() => {
    if (sceneRef.current && tiles.length > 0) {
      sceneRef.current.renderBoard(tiles, onSelectTile);
    }
  }, [tiles, onSelectTile]);

  return <div ref={containerRef} id="phaser-game-container" style={{ width: "100%", height: "100vh" }} />;
};
