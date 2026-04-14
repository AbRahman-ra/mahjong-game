import { LeaderboardEntry } from "../../domain/model/Leaderboard";

export interface ILeaderboardService {
    getTop(n: number): Promise<LeaderboardEntry[]>;
}