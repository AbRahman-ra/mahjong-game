// core/domain/model/Deck.ts
import * as Settings from "../config/Settings";
import * as ArrayHelper from "../../shared/helpers/ArrayHelper";
import { NonNumberTileGroup, NumberTileGroup } from "./TileGroup";
import * as NumberTileValues from "./NumberTileValues";
import { NonNumberTile, NumberTile, Tile } from "./Tile";

/**
 * Domain: should be array of fixed length but it's not worth it :"D 
 */
export type Deck = Tile[];

/**
 * Factory method
 */
export const newDeck = (): Deck => ArrayHelper.shuffle([
    ...buildNumberTiles(NumberTileGroup.NUMBER),
    ...buildNonNumberTiles(NonNumberTileGroup.WIND),
    ...buildNonNumberTiles(NonNumberTileGroup.DRAGON),
]);

/**
 * Draws n tiles from the top of the deck
 * @returns the drawn tiles and the remaining deck, never mutates
 */
export const draw = (
    deck: readonly Tile[],
    count: number = Settings.HAND_SIZE,
): { hand: Tile[]; remaining: Tile[] } => ({
    hand: deck.slice(0, count),
    remaining: deck.slice(count),
});

// ============================ HELPERS ============================
const buildNumberTiles = (type: NumberTileGroup): NumberTile[] => {
    return NumberTileValues.NUMBER_TILES_POSSIBLE_VALUES[type]
        .flatMap(n =>
            Array.from({ length: Settings.TILE_COPIES[type] },
                () => ({ type, value: n } as NumberTile)
            )
        );
};

const buildNonNumberTiles = (type: NonNumberTileGroup): NonNumberTile[] => {
    return Array.from(
        { length: Settings.TILE_COPIES[type] },
        () => ({ type } as NonNumberTile)
    );
};
