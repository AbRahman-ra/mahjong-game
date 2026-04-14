import { Tile, value } from "./Tile";
import { NonNumberTileGroup } from "./TileGroup";

export interface Hand {
    readonly tiles: readonly Tile[];
    readonly total: number;
}

// factory
export const newHand = (
    tiles: Tile[],
    map: Readonly<Record<NonNumberTileGroup, number>>
): Hand => ({
    tiles,
    total: handTotal(tiles, map),
});

export const handTotal = (tiles: Tile[], map: Readonly<Record<NonNumberTileGroup, number>>) => tiles.reduce((sum, t) => sum + value(t, map), 0)
