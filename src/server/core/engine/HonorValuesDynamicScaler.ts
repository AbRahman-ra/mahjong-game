import * as Settings from "../domain/config/Settings";
import { BetOutcome } from "../domain/model/Bet";
import { Hand } from "../domain/model/Hand";
import { isNonNumberTile } from "../domain/model/Tile";
import { NonNumberTileGroup } from "../domain/model/TileGroup";

export const scaleHonorValues = (
    hand: Hand,
    outcome: BetOutcome,
    honorValues: Readonly<Record<NonNumberTileGroup, number>>,
): Record<NonNumberTileGroup, number> => {
    const delta = Settings.DYNAMIC_SCALER[outcome];
    const updated = { ...honorValues };

    hand.tiles
        .filter(isNonNumberTile)
        .forEach(tile => {
            updated[tile.type] = honorValues[tile.type] + delta;
        });

    return updated;
};
