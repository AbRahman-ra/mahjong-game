import { Hand } from "../model/Hand";
import { GameEvent } from "./Event";

export interface SuccessfulBetEvent extends GameEvent<Context> { }

interface Context {
    readonly hand: Hand;
    readonly scoreChange: number;
}