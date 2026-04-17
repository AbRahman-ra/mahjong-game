import { defineStore } from 'pinia';
import { ref } from 'vue';
import { leaderboardService } from '@/server/bootstrap/local';
import type { LeaderboardEntry } from '@/server/core/domain/model/Leaderboard';
import * as Settings from '@/server/core/domain/config/Settings';

export const useLeaderboardStore = defineStore('leaderboard', () => {

    // ================================= STATE =================================
    const entries   = ref<LeaderboardEntry[]>([]);
    const isLoading = ref(false);
    const error     = ref<string | null>(null);

    // ================================= Actions =================================
    async function fetchTop(): Promise<void> {
        isLoading.value = true;
        error.value     = null;
        try {
            entries.value = await leaderboardService.getTop(Settings.LEADERBOARD_SIZE);
        } catch (e) {
            error.value = 'Failed to load leaderboard';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }

    return { entries, isLoading, error, fetchTop };
});