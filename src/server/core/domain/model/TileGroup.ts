import { BetOutcome } from "./Bet";

export enum NonNumberTileGroup {
    DRAGON = "DRAGON",
    WIND = "WIND",
}

export enum NumberTileGroup {
    NUMBER = "NUMBER",
}

export interface TileGroup {
    type: NumberTileGroup | NonNumberTileGroup;
    possibleValues?: number[];
    baseValue?: number;
    accent: string;
    dynamicScaler: Readonly<Record<BetOutcome, number>>;
    copies: number;
}

