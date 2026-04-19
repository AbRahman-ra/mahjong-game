<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import * as Settings from '@/server/core/domain/config/Settings';

const gameStore = useGameStore();
const { discardPile } = storeToRefs(gameStore);

// cap visible tiles for performance
const visibleTiles = computed(() =>
    discardPile.value.slice(-Settings.MAX_VISIBLE_DISCARD_PILES)
);

const discardedPilesArea = ref<HTMLElement | null>(null);
const discardedPilesRect = ref<HTMLElement | null>(null);

defineExpose({ discardedPilesArea, discardedPilesRect })

// generate stable random-looking positions per tile index
// using index as seed keeps positions consistent across re-renders
const getTileStyle = (index: number) => {
    const seed = index * 137.5; // golden angle — spreads values evenly
    const x = ((seed * 13) % 70) - 35;   // -35% to +35%
    const y = ((seed * 7) % 60) - 30;   // -30% to +30%
    const rotate = ((seed * 3) % 30) - 15;   // -15deg to +15deg
    return {
        left: `calc(50% + ${x}%)`,
        top: `calc(50% + ${y}%)`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        zIndex: index,
    };
}
</script>

<template>
    <section class="discard-pile">

        <header class="discard-pile__header">
            <span class="eyebrow">Discard</span>
            <strong>{{ discardPile.length }}</strong>
        </header>

        <div class="discard-pile__area" ref="discardedPilesRect">
            <div v-if="!visibleTiles.length" class="discard-pile__empty">
                <span>No discards yet</span>
            </div>
            <div class="discard-pile__clones" ref="discardedPilesArea"></div>
        </div>
    </section>
</template>

<style scoped>
.discard-pile {
    display: grid;
    gap: 0.75rem;
    height: 100%;
}

/* HEADER */
.discard-pile__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.discard-pile__header strong {
    font-size: 1.1rem;
}

/* SCATTER AREA */
.discard-pile__area {
    position: relative;
    flex: 1;
    min-height: 10rem;
    border-radius: 1.2rem;
    background: rgba(8, 19, 31, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
}

.discard-pile__clones {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.discard-pile__empty {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--ink-soft);
    font-size: 0.88rem;
}

/* DISCARDED TILE */
.discard-pile__tile {
    position: absolute;
    width: 2.8rem;
    height: 3.8rem;
    border-radius: 0.5rem;
    background:
        linear-gradient(135deg, rgba(30, 50, 70, 0.9), rgba(15, 28, 43, 0.95));
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
    transition: opacity 300ms ease;

    background-image:
        repeating-linear-gradient(45deg,
            rgba(255, 255, 255, 0.025) 0px,
            rgba(255, 255, 255, 0.025) 1px,
            transparent 1px,
            transparent 6px),
        linear-gradient(135deg, rgba(30, 50, 70, 0.9), rgba(15, 28, 43, 0.95));
}

/* newest tile on top gets a subtle highlight */
.discard-pile__tile:last-child {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.28),
        0 0 10px rgba(244, 182, 107, 0.08);
}
</style>