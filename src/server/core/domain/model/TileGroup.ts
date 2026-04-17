import { BetOutcome } from "./Bet";
import { TileLabel } from "./TileLabel";
import { TileValue } from "./TileValue";

export enum NonNumberTileGroup {
    DRAGON = "DRAGON",
    WIND = "WIND",
}

export enum NumberTileGroup {
    NUMBER = "NUMBER",
}

export interface TileGroup {
    type: NumberTileGroup | NonNumberTileGroup;
    possibleValues?: TileValue[];
    baseValue?: number;
    accent: string;
    label: TileLabel;
    dynamicScaler?: Readonly<Record<BetOutcome, number>>;
    copies: number;
}
