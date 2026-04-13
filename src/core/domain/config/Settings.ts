import { NonNumberTile } from "../model/Tile";
import { NonNumberTileType } from "../model/TileType";

// system configurations (hand size, number of copies, etc...)
export const NON_NUMBER_TILES_BASE_VALUES: Readonly<
    Record<NonNumberTileType, number>
> = {
    [NonNumberTileType.DRAGON]: 5,
    [NonNumberTileType.WIND]: 5,
};
