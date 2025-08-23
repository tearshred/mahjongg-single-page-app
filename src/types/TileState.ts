// Bringing in the metadata from TileProps.ts so we can extend it
import type { TileSymbol } from "./TileProps";

// Creates a new interface that inherits all metadata (name, path, Component)
export interface TileDataWithState extends TileSymbol {
    isSelected: boolean;
    isClicked: boolean;
    isHighlighted: boolean;
    value: string | number; 
}