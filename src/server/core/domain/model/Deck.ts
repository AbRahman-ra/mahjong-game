import * as Settings from "../config/Settings";
import * as ArrayHelper from "../../shared/helpers/ArrayHelper";
import * as TG from "./TileGroup";
import { NonNumberTile, NumberTile, Tile } from "./Tile";
import { TileLabelFormat } from "./TileLabel";

/**
 * Domain: should be array of fixed length but it's not worth it :"D 
 */
export type Deck = Tile[];

/**
 * Factory method
 */
export const newDeck = (): Deck => ArrayHelper.shuffle([
    ...buildNumberTiles(TG.NumberTileGroup.NUMBER),
    ...buildNonNumberTiles(TG.NonNumberTileGroup.WIND),
    ...buildNonNumberTiles(TG.NonNumberTileGroup.DRAGON),
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
const buildNumberTiles = (type: TG.NumberTileGroup): NumberTile[] => {
    const group = Settings.TILE_GROUPS[type];
    return (group.possibleValues ?? []).flatMap(({ value, label }) =>
        Array.from({ length: group.copies }, () => ({
            id: crypto.randomUUID(),
            type,
            value: { value, label },
        }))
    );
};

const buildNonNumberTiles = (type: TG.NonNumberTileGroup): NonNumberTile[] => {
    const group = Settings.TILE_GROUPS[type];
    return Array.from({ length: group.copies }, () => ({
        id: crypto.randomUUID(),
        type,
        label: group.label, // inherit label from group definition
    }));
};
