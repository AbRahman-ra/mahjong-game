import { GameEvent } from "./Event";

export interface PileOutageEvent extends GameEvent<Context> { }

interface Context {
    readonly remaining: number;
    readonly reshuffles: number;
}
