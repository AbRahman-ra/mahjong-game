<!-- client/views/partials/game/HandHistory.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import TileCard from '@/client/components/TileCard.vue';
import { BetOutcome } from '@/server/core/domain/model/Bet';

const gameStore = useGameStore();
const { history, honorValues } = storeToRefs(gameStore);

// mobile bottom sheet state
const isOpen = ref(false);

const roundCount = computed(() => history.value.length);
</script>

<template>
    <!-- Mobile toggle button -->
    <button class="history-toggle button button-ghost" @click="isOpen = !isOpen" aria-controls="hand-history">
        <span>History</span>
        <strong>{{ roundCount }}</strong>
    </button>

    <!-- Panel -->
    <aside id="hand-history" class="hand-history panel" :class="{ 'hand-history--open': isOpen }">
        <header class="hand-history__header">
            <div>
                <p class="eyebrow">History</p>
                <span class="hand-history__count">{{ roundCount }} rounds</span>
            </div>
            <!-- close button — mobile only -->
            <button class="button button-ghost hand-history__close" @click="isOpen = false">
                Close
            </button>
        </header>

        <!-- Empty state -->
        <p v-if="!history.length" class="hand-history__empty">
            Resolved hands will appear here once the game gets moving.
        </p>

        <!-- Round list -->
        <ol v-else class="hand-history__list" reversed>
            <li v-for="(record, index) in [...history].reverse()" :key="index" class="history-round"
                :class="record.outcome === BetOutcome.WIN ? 'history-round--win' : 'history-round--loss'">
                <!-- Round meta -->
                <div class="history-round__meta">
                    <div>
                        <strong>
                            {{ record.outcome === BetOutcome.WIN ? 'Correct call' : 'Missed call' }}
                        </strong>
                        <p>Hand total: {{ record.hand.total }}</p>
                    </div>
                    <span class="history-round__delta"
                        :class="record.outcome === BetOutcome.WIN ? 'positive' : 'negative'">
                        {{ record.outcome === BetOutcome.WIN ? '+' : '' }}{{ record.scoreChange }}
                    </span>
                </div>

                <!-- Tiles -->
                <div class="history-round__tiles" v-if="honorValues">
                    <TileCard v-for="tile in record.hand.tiles" :key="tile.id" :tile="tile" :honor-values="honorValues"
                        compact />
                </div>
            </li>
        </ol>
    </aside>
</template>

<style scoped>
/* MOBILE TOGGLE */
.history-toggle {
    display: none;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
}

.history-toggle strong {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.8rem;
    min-height: 1.8rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 0.85rem;
}

/* PANEL */
.hand-history {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100%;
    max-height: calc(40dvh);
    position: sticky;
    top: 2rem;
    overflow: hidden;
}

.hand-history__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.hand-history__count {
    color: var(--ink-soft);
    font-size: 0.88rem;
}

.hand-history__close {
    display: none;
}

.hand-history__empty {
    color: var(--ink-soft);
    font-size: 0.9rem;
}

/* LIST */
.hand-history__list {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    list-style: none;
    flex: 1;
    padding-right: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}

.history-round {
    display: grid;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(14, 23, 38, 0.32);
}

.history-round--win {
    box-shadow: inset 0 0 0 1px rgba(105, 190, 140, 0.2);
}

.history-round--loss {
    box-shadow: inset 0 0 0 1px rgba(200, 95, 95, 0.2);
}

/* ── Round meta ──────────────────────────────────────────────────────────── */

.history-round__meta {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 0.8rem;
}

.history-round__meta strong {
    display: block;
    margin-bottom: 0.2rem;
}

.history-round__meta p {
    color: var(--ink-soft);
    font-size: 0.88rem;
    margin: 0;
}

.history-round__delta {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
}

.history-round__delta.positive {
    color: #6dbf8f;
}

.history-round__delta.negative {
    color: var(--rose);
}

/* ── Tiles ───────────────────────────────────────────────────────────────── */

.history-round__tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.55rem;
}

/* ── Mobile bottom sheet ─────────────────────────────────────────────────── */

@media (max-width: 1080px) {
    .history-toggle {
        display: flex;
    }

    .hand-history {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 70vh;
        border-radius: 1.6rem 1.6rem 0 0;
        transform: translateY(100%);
        transition: transform 320ms ease;
        z-index: 100;
    }

    .hand-history--open {
        transform: translateY(0);
    }

    .hand-history__close {
        display: block;
    }
}

@media (max-width: 640px) {
    .history-round__tiles {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>