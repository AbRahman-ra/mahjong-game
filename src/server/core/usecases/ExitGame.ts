import { IExitGameService } from "../ports/in/IGameService";
import { IGameRepo } from "../ports/out/IGameRepo";
import { ILeaderboardRepo } from "../ports/out/ILeaderboardRepo";
import { LeaderboardEntry } from "../domain/model/Leaderboard";

export class ExitGame implements IExitGameService {
    constructor(
        private readonly gameRepo: IGameRepo,
        private readonly leaderboardRepo: ILeaderboardRepo,
    ) {}

    async exitGame(playerName: string, saveScore: boolean): Promise<void> {
        const state = await this.gameRepo.load();
        if (!state) throw new Error("No active game session");

        if (saveScore) {
            const entry: LeaderboardEntry = {
                playerName,
                score: state.score,
                date: new Date().toISOString(),
            };
    
            await this.leaderboardRepo.save(entry);
        }

        await this.gameRepo.clear();
    }
}
