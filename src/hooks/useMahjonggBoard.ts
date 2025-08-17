import { useMahjonggTileData } from "./useMahjonggTileData"

export function useMahjonggBoard() {
    
    // Storing the list of tiles inside the `tileData` variable
    const tileData = useMahjonggTileData();
    return tileData;
}