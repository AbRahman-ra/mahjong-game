<!-- client/views/LandingView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Leaderboard from '@/client/components/Leaderboard.vue';
import { useGameStore } from '@/client/store/gameStore';
// import { useLeaderboardStore } from '@/client/store/leaderboardStore';
import * as Settings from '@/server/core/domain/config/Settings';

const router = useRouter();
const gameStore = useGameStore();
// const leaderboardStore = useLeaderboardStore();

// const { entries, isLoading } = storeToRefs(leaderboardStore);

// onMounted(() => leaderboardStore.fetchTop());

async function startNewGame() {
    await gameStore.initGame();
    router.push({ name: 'game' });
}
</script>

<template>
    <section class="landing-view layout-shell">

        <!-- Hero panel -->
        <section class="landing-view__hero panel panel-accent">
            <p class="eyebrow">Penny Software Assessment</p>
            <h1>Mahjong Hand Betting Game</h1>

            <p class="landing-view__lead">
                Read the table, trust your call, and survive the honor tile
                swings before the deck burns out.
            </p>

            <!-- Game stats -->
            <ul class="landing-view__stats">
                <li>
                    <span class="stat-label">Deck</span>
                    <strong>{{ Settings.DECK_SIZE }} tiles</strong>
                </li>
                <li>
                    <span class="stat-label">Hand Size</span>
                    <strong>{{ Settings.HAND_SIZE }} tiles</strong>
                </li>
                <li>
                    <span class="stat-label">Fail State</span>
                    <strong>{{ Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX }} reshuffles</strong>
                    <strong>Any tile drop to {{ Settings.GAME_OVER_CONDITIONS.TILE_MIN }} </strong>
                    <strong>Any tile rise to {{ Settings.GAME_OVER_CONDITIONS.TILE_MAX }}</strong>
                </li>
            </ul>

            <button class="button" @click="startNewGame">
                Start New Game
            </button>
        </section>

        <!-- Leaderboard -->
        <Leaderboard />

    </section>
</template>

<style scoped>
.landing-view {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(20rem, 0.9fr);
    gap: 1.5rem;
    align-items: stretch;
}

.landing-view__hero {
    display: grid;
    gap: 1.5rem;
    align-content: center;
}

.landing-view__hero h1 {
    max-width: 12ch;
    font-size: clamp(2.6rem, 6vw, 5.2rem);
    line-height: 0.95;
}

.landing-view__lead {
    max-width: 44rem;
    font-size: 1.12rem;
    color: var(--ink-soft);
}

/* ── Stats ───────────────────────────────────────────────────────────────── */

.landing-view__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.8rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.landing-view__stats li {
    display: grid;
    gap: 0.45rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(17, 31, 43, 0.24);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-label {
    color: var(--ink-soft);
    font-size: 0.84rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1rem;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */

@media (max-width: 960px) {
    .landing-view {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .landing-view__stats {
        grid-template-columns: 1fr;
    }
}
</style>