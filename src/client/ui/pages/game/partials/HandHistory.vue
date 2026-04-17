<!-- client/views/partials/game/HandHistory.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import TileCard from '@/client/ui/components/TileCard.vue';
import { BetOutcome } from '@/server/core/domain/model/Bet';

const gameStore = useGameStore();
const { history, honorValues } = storeToRefs(gameStore);

// mobile bottom sheet state
const isOpen = ref(false);

const roundCount = computed(() => history.value.length);
</script>

<template>
    <!-- Panel -->
    <aside id="hand-history" class="hand-history panel" :class="{ 'hand-history--open': isOpen }">
        <header class="hand-history__header">
            <div>
                <p class="eyebrow">History</p>
                <span class="hand-history__count">{{ roundCount }} rounds</span>
            </div>
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
/* PANEL */
.hand-history {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100%;
    max-height: calc(50dvh);
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
    .history-round__tiles {
        grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
    }
}
</style>