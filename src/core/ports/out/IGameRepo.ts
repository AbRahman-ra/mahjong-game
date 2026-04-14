import { GameState } from "../../domain/model/GameState";

export interface IGameRepo {
    save(state: GameState): Promise<void>;
    load(): Promise<GameState | undefined>;
    clear(): Promise<void>;
}
