<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import TileCard from '@/client/components/TileCard.vue';
// import BetControls from '@/client/components/BetControls.vue';
import { BetDirection } from '@/server/core/domain/model/Bet';

const gameStore = useGameStore();
const { currentHand, honorValues, isBetting } = storeToRefs(gameStore);

// async function onBet(direction: BetDirection) {
//     await gameStore.placeBet(direction);
// }
</script>

<template>
    <section class="current-hand">
        <!-- Tile strip -->
        <section class="current-hand__strip panel" v-if="currentHand && honorValues">

            <section class="current-hand__tiles">
                <TileCard v-for="tile in currentHand.tiles" :key="tile.id" :tile="tile" :honor-values="honorValues" />
            </section>

            <!-- Total -->
            <footer class="current-hand__total">
                <span class="eyebrow">Hand Total</span>
                <strong>{{ currentHand.total }}</strong>
            </footer>

        </section>

        <!-- Floating betting controls -->
        <!-- <section class="current-hand__controls">
            <BetControls :disabled="!isBetting" @bet="onBet" />
        </section> -->

    </section>
</template>

<style scoped>
.current-hand {
    display: grid;
    gap: 1rem;
}

/* TILES STRIP */
.current-hand__strip {
    display: grid;
    gap: 1rem;
}

.current-hand__tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
}

/* TOTAL */
.current-hand__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.current-hand__total strong {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    line-height: 1;
    color: var(--gold);
}

/* BETTING CONTROLS */
.current-hand__controls {
    display: flex;
    justify-content: center;
}

.current-hand__controls>* {
    width: min(100%, 36rem);
}

/* RESPONSIVENESS */
@media (max-width: 640px) {
    .current-hand__tiles {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>