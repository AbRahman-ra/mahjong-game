<script setup lang="ts">
import CurrentHand from '@/client/pages/game/partials/CurrentHand.vue';
import BetControls from '@/client/components/BetControls.vue';
import { useGameStore } from '@/client/store/gameStore';
import { storeToRefs } from 'pinia';
import { BetDirection } from '@/server/core/domain/model/Bet';

const gameStore = useGameStore();
const { isBetting } = storeToRefs(gameStore);
async function onBet(direction: BetDirection) {
    await gameStore.placeBet(direction);
}
</script>

<template>
    <div class="game-data">
        <CurrentHand />
    </div>

    <section class="current-hand__controls">
        <BetControls :disabled="!isBetting" @bet="onBet" />
    </section>
</template>

<style scoped>
.game-data {
    display: grid;
    gap: 1.5rem;
}
</style>