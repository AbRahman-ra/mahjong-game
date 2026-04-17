<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import * as Settings from '@/server/core/domain/config/Settings';

const { drawPile, discardPile, reshuffleCount } = storeToRefs(useGameStore());

const isReshuffleWarning = computed(() =>
    reshuffleCount.value >= Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX - 1
);
</script>

<template>
    <div class="pile-counters">
        <div class="counter-card">
            <span>Draw</span>
            <strong>{{ drawPile.length }}</strong>
        </div>
        <div class="counter-card">
            <span>Discard</span>
            <strong>{{ discardPile.length }}</strong>
        </div>
        <div class="counter-card" :class="{ 'counter-card--warning': isReshuffleWarning }">
            <span>Reshuffles</span>
            <strong>{{ reshuffleCount }} / {{ Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX }}</strong>
        </div>
    </div>
</template>

<style scoped>
.pile-counters {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.counter-card {
    display: grid;
    gap: 0.15rem;
    min-width: 6rem;
    padding: 0.75rem 0.9rem;
    border-radius: 1rem;
    background: rgba(14, 23, 38, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: border-color 300ms ease, box-shadow 300ms ease;
}

.counter-card span {
    color: var(--ink-soft);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.counter-card strong {
    font-size: 1.2rem;
}

.counter-card--warning {
    border-color: rgba(222, 120, 105, 0.35);
    box-shadow: 0 0 12px rgba(222, 120, 105, 0.12);
}

.counter-card--warning strong {
    color: var(--rose);
}
</style>