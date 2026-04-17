<script setup lang="ts">
import { BetDirection } from '@/server/core/domain/model/Bet';

defineProps<{
    disabled: boolean;
}>();

const emit = defineEmits<{
    bet: [direction: BetDirection];
}>();
</script>

<template>
    <section class="betting-controls" :class="{ 'betting-controls--active': !disabled }">

        <header class="betting-controls__label">
            <p class="eyebrow">Make Your Call</p>
            <h3>What's your next bet?</h3>
        </header>

        <section class="betting-controls__actions">
            <button class="button button-secondary" :disabled="disabled" @click="emit('bet', BetDirection.LOWER)">
                Bet Lower
            </button>

            <button class="button" :disabled="disabled" @click="emit('bet', BetDirection.HIGHER)">
                Bet Higher
            </button>
        </section>
    </section>
</template>

<style scoped>
.betting-controls {
    display: grid;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-radius: 1.6rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(8, 19, 31, 0.72);
    backdrop-filter: blur(14px);
    transition: box-shadow 300ms ease, border-color 300ms ease;
}

/* glows when it's the player's turn */
.betting-controls--active {
    border-color: rgba(244, 182, 107, 0.35);
    box-shadow:
        0 0 0 1px rgba(244, 182, 107, 0.15),
        0 0 32px rgba(244, 182, 107, 0.12),
        0 8px 24px rgba(0, 0, 0, 0.24);
}

.betting-controls__label h3 {
    font-size: clamp(1.1rem, 2.5vw, 1.6rem);
}

.betting-controls__actions {
    display: grid;
    gap: 0.8rem;
}

@media (max-width: 480px) {
    .betting-controls__actions {
        grid-template-columns: 1fr;
    }
}
</style>