import { GameState } from "../../domain/model/GameState";
import { BetDirection } from "../../domain/model/Bet";

export interface IInitGameService {
    initGame(): Promise<GameState>;
}

export interface IPlaceBetService {
    placeBet(bet: BetDirection): Promise<GameState>;
}

export interface IExitGameService {
    exitGame(playerName: string, saveScore: boolean): Promise<void>;
}

export interface IGameService extends IInitGameService, IPlaceBetService, IExitGameService {}
