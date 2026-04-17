<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import ScoreDisplay from '@/client/components/ScoreDisplay.vue';
import PileCounters from './PileCounters.vue';
import ExitButton from './ExitButton.vue';

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
        <ExitButton @exit="emit('exit')" />

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

/* RESPONSIVENESS */
@media (max-width: 720px) {
    .topbar {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>