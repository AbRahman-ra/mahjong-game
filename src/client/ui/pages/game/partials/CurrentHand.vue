<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/client/store/gameStore';
import TileCard from '@/client/ui/components/TileCard.vue';

const gameStore = useGameStore();
const { currentHand, honorValues, isBetting } = storeToRefs(gameStore);

</script>

<template>
    <div class="current-hand">
        <!-- Tile strip -->
        <div class="current-hand__strip panel" v-if="currentHand && honorValues">

            <div class="current-hand__tiles">
                <TileCard v-for="tile in currentHand.tiles" :key="tile.id" :tile="tile" :honor-values="honorValues" />
            </div>

            <!-- Total -->
            <footer class="current-hand__total">
                <span class="eyebrow">Hand Total</span>
                <strong>{{ currentHand.total }}</strong>
            </footer>

        </div>

    </div>
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

/* RESPONSIVENESS */
@media (max-width: 1080px) {
    .current-hand__tiles {
        grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
    }
}
</style>