import { IGameRepo } from "../../core/ports/out/IGameRepo";
import { GameState } from "../../core/domain/model/GameState";

const GAME_STATE_KEY = "game_state";

export class LocalStorageGameRepo implements IGameRepo {
    async save(state: GameState): Promise<void> {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    }

    async load(): Promise<GameState | undefined> {
        const raw = localStorage.getItem(GAME_STATE_KEY);
        if (!raw) return undefined;
        return JSON.parse(raw) as GameState;
    }

    async clear(): Promise<void> {
        localStorage.removeItem(GAME_STATE_KEY);
    }
}
