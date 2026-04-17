<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import ScoreDisplay from '@/client/components/ScoreDisplay.vue';
import PileCounters from './PileCounters.vue';
import ExitButton from '../../../components/ExitButton.vue';

const emit = defineEmits<{
    exit: [];
}>();

const gameStore = useGameStore();
const { score } = storeToRefs(gameStore);
</script>

<template>
    <header class="topbar panel">
        <ScoreDisplay :score="score" />
        <PileCounters />
        <ExitButton class="exit-btn" @exit="emit('exit')" />

    </header>
</template>

<style scoped>
.topbar {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
}

.exit-btn {
    justify-self: flex-end;
}

/* RESPONSIVENESS */
@media (max-width: 720px) {
    .topbar {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        align-items: center;
        gap: 0.75rem;
    }
}
</style>