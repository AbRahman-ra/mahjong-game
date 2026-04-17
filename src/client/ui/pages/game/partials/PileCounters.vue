<script setup lang="ts">
import DropDownButton from '@/client/ui/components/DropDownButton.vue';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import * as Settings from '@/server/core/domain/config/Settings';

const { drawPile, discardPile, reshuffleCount } = storeToRefs(useGameStore());

const isReshuffleWarning = computed(() =>
    reshuffleCount.value >= Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX - 1
);

// mobile expansion
const isExpanded = ref(false);
</script>

<template>
    <div class="wrapper" :class="{ 'wrapper--expanded': isExpanded }">
        <div class="pile-counters">

            <div class="counter-card dropdown-face" :class="{ 'counter-card--warning': isReshuffleWarning }">
                <span>Reshuffles</span>
                <strong>{{ reshuffleCount }} / {{ Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX }}</strong>
            </div>
            <div class="counter-card">
                <span>Draw</span>
                <strong>{{ drawPile.length }}</strong>
            </div>
            <div class="counter-card">
                <span>Discard</span>
                <strong>{{ discardPile.length }}</strong>
            </div>

        </div>

        <DropDownButton class="counters-dropdown" @expanded="isExpanded = $event" />
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

.counters-dropdown {
    display: none;
}

/* RESPONSIVENESS */
@media (max-width: 1080px) {
    .wrapper {
        display: flex;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .pile-counters {
        gap: 0;
        /* Remove gap from collapsed dropdown */
    }

    .wrapper--expanded .pile-counters {
        gap: 0.75rem;
        /* restore gap when expanded */
    }

    .counters-dropdown {
        display: inline-flex;
        width: 2rem;
        fill: var(--teal);
        padding: 0.5rem;
        flex-shrink: 0;
        align-self: flex-start;
    }

    .counter-card {
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        opacity: 0;
        overflow: hidden;
        border: 0;
        min-width: 0;
        transition: max-height 300ms ease,
            opacity 300ms ease,
            padding 300ms ease;
    }

    .wrapper--expanded .counter-card {
        max-height: 6rem;
        padding: 0.75rem 0.9rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        opacity: 1;
    }

    .dropdown-face {
        max-height: 6rem;
        padding: 0.9rem;
        opacity: 1;
        border: 0;
    }

    .wrapper--expanded .dropdown-face {
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
}
</style>