import { ILeaderboardRepo } from "../../core/ports/out/ILeaderboardRepo";
import { LeaderboardEntry } from "../../core/domain/model/Leaderboard";
import * as Settings from "../../core/domain/config/Settings";

const LEADERBOARD_KEY = "leaderboard";

export class LocalStorageLeaderboardRepo implements ILeaderboardRepo {
    async save(entry: LeaderboardEntry): Promise<void> {
        const current = await this.getTop(Settings.LEADERBOARD_SIZE);

        const updated = [...current, entry]
            .sort((a, b) => b.score - a.score)
            .slice(0, Settings.LEADERBOARD_SIZE);

        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    }

    async getTop(n: number): Promise<LeaderboardEntry[]> {
        const raw = localStorage.getItem(LEADERBOARD_KEY);
        if (!raw) return [];
        return (JSON.parse(raw) as LeaderboardEntry[]).slice(0, n);
    }
}
