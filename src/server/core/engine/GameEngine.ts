/**
 * Domain Service: Game logic
 * This is just a facade for every other module in this directory for better modulatiry
 */
import * as INIT from "./GameInitializer";
import * as Bet from "../domain/model/Bet";
import * as GS from "../domain/model/GameState";
import * as MAN from "./BetsManager";
import * as GOVR from "./GameOverChecker";

export const initGame = () => INIT.initGame();
export const placeBet = (state: GS.GameState, bet: Bet.BetDirection): GS.GameState => MAN.placeBet(state, bet);
export const resolveBet = (state: GS.GameState): GS.GameState => MAN.resolveBet(state);
export const isGameOver = (state: GS.GameState): GS.GameOverReason | undefined => GOVR.isGameOver(state);
