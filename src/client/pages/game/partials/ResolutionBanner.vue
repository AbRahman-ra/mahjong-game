<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import { BetOutcome } from '@/server/core/domain/model/Bet';

const gameStore = useGameStore();
const { history } = storeToRefs(gameStore);

const lastRecord = computed(() => history.value.at(-1) ?? null);
const isWin = computed(() => lastRecord.value?.outcome === BetOutcome.WIN);
const tone = computed(() => {
    if (!lastRecord.value) return 'idle';
    return isWin.value ? 'win' : 'loss';
});
</script>

<template>
    <section class="resolution-banner panel" :class="`resolution-banner--${tone}`">

        <!-- First round (no history yet) -->
        <template v-if="!lastRecord">
            <p class="eyebrow">Table Read</p>
            <h3>First call is all instinct.</h3>
            <p class="resolution-banner__sub">
                Make a prediction to see score motion and honor tile scaling build up.
            </p>
        </template>

        <!-- Result of last round -->
        <template v-else>
            <p class="eyebrow">
                {{ isWin ? 'Round Won' : 'Round Lost' }}
            </p>
            <h3 class="resolution-banner__delta" :class="isWin ? 'positive' : 'negative'">
                {{ isWin ? '+' : '' }}{{ lastRecord.scoreChange }}
                <span>points</span>
            </h3>
            <p class="resolution-banner__sub">
                Hand total was
                <strong>{{ lastRecord.hand.total }}</strong>
            </p>
        </template>

    </section>
</template>

<style scoped>
.resolution-banner {
    display: grid;
    gap: 0.45rem;
    transition: box-shadow 300ms ease;
}

.resolution-banner__sub {
    color: var(--ink-soft);
    font-size: 0.95rem;
}

/* TONES */
.resolution-banner--idle {
    border-color: rgba(255, 255, 255, 0.08);
}

.resolution-banner--win {
    box-shadow: 0 0 0 1px rgba(104, 185, 137, 0.28),
        0 14px 30px rgba(104, 185, 137, 0.12);
}

.resolution-banner--loss {
    animation: loss-shake 360ms ease;
    box-shadow: 0 0 0 1px rgba(202, 96, 96, 0.28),
        0 14px 30px rgba(202, 96, 96, 0.12);
}

/* SCORE DIFFS */
.resolution-banner__delta {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1;
}

.resolution-banner__delta span {
    font-family: inherit;
    font-size: 1rem;
    font-weight: normal;
    color: var(--ink-soft);
}

.resolution-banner__delta.positive {
    color: #6dbf8f;
}

.resolution-banner__delta.negative {
    color: var(--rose);
}

/* ANIMATIONS */
@keyframes loss-shake {
    20% {
        transform: translateX(-6px);
    }

    40% {
        transform: translateX(6px);
    }

    60% {
        transform: translateX(-4px);
    }

    80% {
        transform: translateX(4px);
    }
}
</style>