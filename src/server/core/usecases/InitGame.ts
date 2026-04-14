import { IInitGameService } from "../ports/in/IGameService";
import { IGameRepo } from "../ports/out/IGameRepo";
import { GameState } from "../domain/model/GameState";
import * as ENGINE from "../engine/GameEngine";

export class InitGame implements IInitGameService {
    constructor(
        private readonly gameRepo: IGameRepo,
    ) {}

    async initGame(): Promise<GameState> {
        const state = ENGINE.initGame();
        await this.gameRepo.save(state);
        return state;
    }
}