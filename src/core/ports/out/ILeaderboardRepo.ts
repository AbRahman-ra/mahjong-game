import { LeaderboardEntry } from "../../domain/model/Leaderboard";

export interface ILeaderboardRepo {
    save(entry: LeaderboardEntry): Promise<void>;
    getTop(n: number): Promise<LeaderboardEntry[]>;
}