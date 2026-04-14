import { ILeaderboardService } from "../ports/in/ILeaderboardService";
import { ILeaderboardRepo } from "../ports/out/ILeaderboardRepo";
import { LeaderboardEntry } from "../domain/model/Leaderboard";
import * as Settings from "../domain/config/Settings";

export class GetLeaderboard implements ILeaderboardService {
    constructor(private readonly leaderboardRepo: ILeaderboardRepo) {}

    async getTop(
        n: number = Settings.LEADERBOARD_SIZE,
    ): Promise<LeaderboardEntry[]> {
        return this.leaderboardRepo.getTop(n);
    }
}
