import { generateTurtleLayout } from "./layout-builder";
import type { TileDataWithState } from "../../types/TileState";

export default function assignTilePositions(tiles: TileDataWithState[]): TileDataWithState[] {
    
    const positions = generateTurtleLayout();

    return tiles.map((tile, index) => ({
        ...tile,
        position: positions[index],
    }));

}
