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
        <BetControls :disabled="!isBetting" @bet="onBet" />
    </div>


</template>

<style scoped>
.game-data {
    display: grid;
    grid-template-columns: 1fr 30%;
    gap: 1rem;
}

@media (max-width: 1080px) {
    .game-data {
        grid-template-columns: 1fr;
    }
}
</style>