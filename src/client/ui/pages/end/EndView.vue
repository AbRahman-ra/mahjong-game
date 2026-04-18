<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import { useLeaderboardStore } from '@/client/store/leaderboardStore';
import { GameOverReason } from '@/server/core/domain/model/GameState';
import ScoreDisplay from '@/client/ui/components/ScoreDisplay.vue';
import Leaderboard from '@/client/ui/components/Leaderboard.vue';
import * as Settings from '@/server/core/domain/config/Settings';

const router = useRouter();
const gameStore = useGameStore();
const leaderboardStore = useLeaderboardStore();

const { score, gameOverReason } = storeToRefs(gameStore);
const { entries, isLoading } = storeToRefs(leaderboardStore);

const playerName = ref('');
const hasSaved = ref(false);

onMounted(() => leaderboardStore.fetchTop());

const REASON_MESSAGES: Record<GameOverReason, string> = {
    [GameOverReason.RESHUFFLE_LIMIT]: `The deck burned out after ${Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX} reshuffles.`,
    [GameOverReason.TILE_VALUE_MIN]: `A non-number tile collapsed to ${Settings.GAME_OVER_CONDITIONS.TILE_MIN} (minimum value).`,
    [GameOverReason.TILE_VALUE_MAX]: `A non-number tile surged to ${Settings.GAME_OVER_CONDITIONS.TILE_MAX} (maximum value).`,
};

const reasonMessage = computed(() =>
    gameOverReason.value
        ? REASON_MESSAGES[gameOverReason.value]
        : 'The run is over.'
);

const saveScore = async () => {
    if (!playerName.value.trim() || hasSaved.value) return;
    await gameStore.exitGame(playerName.value.trim(), true);
    await leaderboardStore.fetchTop();
    hasSaved.value = true;
}

async function playAgain() {
    await gameStore.initGame();
    router.push({ name: 'game' });
}

async function goHome() {
    if (!hasSaved.value) await gameStore.exitGame('', false);
    router.push({ name: 'landing' });
}
</script>

<template>
    <section class="end-view layout-shell">

        <!-- Summary panel -->
        <div class="end-view__summary panel panel-accent">
            <p class="eyebrow">Run Complete</p>

            <ScoreDisplay :score="score" />

            <p class="end-view__reason">{{ reasonMessage }}</p>

            <form @submit.prevent="saveScore">
                <div class="field">
                    <label for="player-name">Player name</label>
                    <input id="player-name" v-model="playerName" type="text" maxlength="24"
                        placeholder="Enter your name" :disabled="hasSaved" />
                </div>

                <!-- Actions -->
                <div class="end-view__actions">
                    <button type="submit" class="button" :disabled="!playerName.trim() || hasSaved">
                        {{ hasSaved ? 'Saved ✅' : 'Save to Leaderboard' }}
                    </button>
                    <a class="button button-secondary" @click="playAgain">
                        Play Again
                    </a>
                    <a class="button button-ghost" @click="goHome">
                        Go Home
                    </a>
                </div>
            </form>
        </div>

        <!-- Leaderboard -->
        <Leaderboard :entries="entries" :is-loading="isLoading" />

    </section>
</template>

<style scoped>
.end-view {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
    gap: 1.5rem;
}

.end-view__summary {
    display: grid;
    gap: 1.25rem;
    align-content: center;
}

.end-view__reason {
    max-width: 34rem;
    color: var(--ink-soft);
    font-size: 1.05rem;
}

form {
    display: grid;
    gap: 1rem;
}

.field {
    display: grid;
    gap: 0.45rem;
}

.field label {
    color: var(--ink-soft);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.84rem;
}

.field input {
    width: 100%;
    padding: 0.95rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 1rem;
    background: rgba(14, 23, 38, 0.36);
    color: var(--paper);
    font: inherit;
    transition: opacity 200ms ease;
}

.field input:focus {
    outline: 2px solid rgba(244, 182, 107, 0.35);
    outline-offset: 2px;
}

.field input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Actions */

.end-view__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
}

/* Responsive */

@media (max-width: 960px) {
    .end-view {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .end-view__actions {
        flex-direction: column;
    }
}
</style>