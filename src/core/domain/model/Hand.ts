import { NON_NUMBER_TILES_BASE_VALUES } from "../config/Settings";
import { Tile, value } from "./Tile";

export interface Hand {
    readonly tiles: readonly Tile[];
    readonly total: number;
}

// factory
export const newHand = (
    tiles: Tile[]
): Hand => ({
    tiles,
    total: tiles.reduce((sum, t) => sum + value(t, NON_NUMBER_TILES_BASE_VALUES), 0),
});