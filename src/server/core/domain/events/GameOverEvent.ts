import { GameOverReason } from "../model/GameState";
import { GameEvent } from "./Event";

export interface GameOverEvent extends GameEvent<Context> { }

interface Context {
    readonly reason: GameOverReason;
    readonly finalScore: number;
}