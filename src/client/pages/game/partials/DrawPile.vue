<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import * as Settings from '@/server/core/domain/config/Settings';

const gameStore = useGameStore();
const { drawPile } = storeToRefs(gameStore);

const visibleTiles = computed(() =>
    Math.min(drawPile.value.length, Settings.MAX_VISIBLE_DRAW_PILES)
);

const fillPercent = computed(() =>
    Math.round((drawPile.value.length / Settings.DECK_SIZE) * 100)
);
</script>

<template>
    <aside class="draw-pile">

        <!-- Stacked face-down tiles -->
        <div class="draw-pile__stack">
            <div v-for="i in visibleTiles" :key="i" class="draw-pile__tile" :style="{ '--offset': i }" />
        </div>

        <!-- Count + fill indicator -->
        <div class="draw-pile__info">
            <span class="eyebrow">Draw</span>
            <strong>{{ drawPile.length }}</strong>
            <div class="draw-pile__fill">
                <div class="draw-pile__fill-bar" :style="{ height: `${fillPercent}%` }" />
            </div>
        </div>

    </aside>
</template>

<style scoped>
.draw-pile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    height: 100%;
}

/* ── Stacked tiles ───────────────────────────────────────────────────────── */

.draw-pile__stack {
    position: relative;
    width: 3.5rem;
    flex: 1;
    min-height: 8rem;
}

.draw-pile__tile {
    position: absolute;
    width: 3.5rem;
    height: 4.8rem;
    border-radius: 0.6rem;
    background:
        linear-gradient(135deg, rgba(30, 50, 70, 0.95), rgba(15, 28, 43, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

    /* stack from bottom upward */
    bottom: calc(var(--offset) * 3px);
    left: 50%;
    transform: translateX(-50%);

    /* subtle pattern on tile back */
    background-image:
        repeating-linear-gradient(45deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 6px),
        linear-gradient(135deg, rgba(30, 50, 70, 0.95), rgba(15, 28, 43, 0.98));
}

/* top tile has a subtle glow */
.draw-pile__tile:last-child {
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.3),
        0 0 12px rgba(98, 193, 177, 0.08);
    border-color: rgba(98, 193, 177, 0.2);
}

/* PILE INFO */
.draw-pile__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.draw-pile__info strong {
    font-size: 1.2rem;
    line-height: 1;
}

/* PILE INFO BAR */
.draw-pile__fill {
    width: 1rem;
    height: 3rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    display: flex;
    align-items: flex-end;
}

.draw-pile__fill-bar {
    width: 100%;
    border-radius: 1rem;
    background: linear-gradient(180deg, var(--teal), rgba(98, 193, 177, 0.4));
    transition: height 400ms ease;
    min-height: 4px;
}
</style>