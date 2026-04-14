import * as GS from "../domain/model/GameState"
import * as Settings from "../domain/config/Settings";

/**
 * @param state 
 * @returns 
 */
export const isGameOver = (state: GS.GameState): GS.GameOverReason | undefined => {
    if (isReshuffleLimitReached(state)) return GS.GameOverReason.RESHUFFLE_LIMIT;

    for (const val of Object.values(state.honorValues)) {
        if (val <= Settings.GAME_OVER_CONDITIONS.TILE_MIN) return GS.GameOverReason.TILE_VALUE_MIN;
        if (val >= Settings.GAME_OVER_CONDITIONS.TILE_MAX) return GS.GameOverReason.TILE_VALUE_MAX;
    }

    return undefined;
}

export const isReshuffleLimitReached = (state: GS.GameState): boolean =>
    state.reshuffleCount >= Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX;