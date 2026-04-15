<script setup lang="ts">
import type { LeaderboardEntry } from '@/server/core/domain/model/Leaderboard';

defineProps<{
    entries: LeaderboardEntry[];
    isLoading: boolean;
}>();

const formatDate = (value: string): string => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

</script>

<template>
    <section class="leaderboard panel">

        <header class="leaderboard__header">
            <p class="eyebrow">Top Five</p>
            <h3>Leaderboard</h3>
        </header>

        <p v-if="isLoading" class="leaderboard__empty">
            Loading...
        </p>

        <ul v-else-if="entries.length" class="leaderboard__rows">
            <li v-for="(entry, index) in entries" :key="`${entry.playerName}-${entry.date}-${entry.score}`"
                class="leaderboard__row">
                <span class="leaderboard__rank">{{ index + 1 }}</span>
                <div class="leaderboard__info">
                    <strong>{{ entry.playerName }}</strong>
                    <p>{{ formatDate(entry.date) }}</p>
                </div>
                <span class="leaderboard__score">{{ entry.score }}</span>
            </li>
        </ul>

        <p v-else class="leaderboard__empty">
            No scores yet. Start a run and set the pace.
        </p>

    </section>
</template>

<style scoped>
.leaderboard {
    display: grid;
    gap: 1rem;
}

.leaderboard__rows {
    display: grid;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.leaderboard__row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1rem;
    border-radius: 1rem;
    background: rgba(14, 23, 38, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.leaderboard__rank,
.leaderboard__score {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.35rem;
    min-height: 2.35rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 700;
}

.leaderboard__info p,
.leaderboard__empty {
    color: var(--ink-soft);
    margin: 0;
}
</style>