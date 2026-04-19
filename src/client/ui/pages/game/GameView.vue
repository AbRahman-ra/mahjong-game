<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/client/store/gameStore';

import GameTopbar from '@/client/ui/pages/game/partials/Topbar.vue';
import GameTable from '@/client/ui/pages/game/partials/GameTable.vue';
import HandHistory from '@/client/ui/pages/game/partials/HandHistory.vue';
import ExitConfirmDialog from '@/client/ui/pages/game/partials/ExitConfirmDialog.vue';
import ResolutionBanner from './partials/ResolutionBanner.vue';
import CurrentHand from './partials/CurrentHand.vue';
import BetControls from '@/client/ui/components/BetControls.vue';
import { storeToRefs } from 'pinia';
import { BetDirection } from '@/server/core/domain/model/Bet';
import { useThrowAnimation } from '@/client/composables/useThrowAnimation';
import { useDrawPileAnimation } from '@/client/composables/useDrawPileAnimation';

const router = useRouter();
const gameStore = useGameStore();

const showExitConfirm = ref(false);
const { isBetting } = storeToRefs(gameStore);

// betting handling
const gameTableRef = ref<InstanceType<typeof GameTable> | null>(null);
const currentHandRef = ref<InstanceType<typeof CurrentHand> | null>(null);
const pileAreaRef = computed(() => gameTableRef.value?.discardedPilesArea ?? null);
const { throwTiles } = useThrowAnimation(pileAreaRef, "[data-tile-id]");

const drawPileRef = computed(() => gameTableRef.value?.drawPileWrapper ?? null);
const { dealTiles } = useDrawPileAnimation(drawPileRef);
const showNextHand = ref(false);

async function onBet(direction: BetDirection) {
    const container = currentHandRef.value?.currentHandTilesWrapper;
    if (container) await throwTiles(container);

    await gameStore.drawNextHand(direction);
    if (gameStore.isGameOver) return;
    await nextTick();

    showNextHand.value = true;
    await nextTick();

    const currentContainer = currentHandRef.value?.currentHandTilesWrapper;
    if (currentContainer) await dealTiles(currentContainer);
    showNextHand.value = false;
    await gameStore.resolveBet();
}

async function confirmExit() {
    showExitConfirm.value = false;
    await gameStore.exitGame('', false);
    router.push({ name: 'landing' });
}
</script>

<template>
    <div class="game-view layout-shell">

        <GameTopbar @exit="showExitConfirm = true" />

        <div class="game-view__body">

            <div class="game-view__left">
                <GameTable ref="gameTableRef" />
                <div class="game-data">
                    <CurrentHand ref="currentHandRef" :show-next-hand="showNextHand" />
                    <BetControls class="game-data__desktop" :disabled="!isBetting" @bet="onBet" />
                </div>
            </div>

            <!-- Shown on mobile view -->
            <div class="game-data__mobile">
                <BetControls :disabled="!isBetting" @bet="onBet" />
                <ResolutionBanner />
            </div>

            <div class="game-view__right">
                <ResolutionBanner class="game-data__desktop" />
                <HandHistory />
            </div>
        </div>

        <ExitConfirmDialog :show="showExitConfirm" @confirm="confirmExit" @cancel="showExitConfirm = false" />

    </div>
</template>

<style scoped>
.game-view {
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
    padding-bottom: 2rem;
}

.game-view__body {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(22rem, 0.7fr);
    gap: 1.35rem;
    align-items: start;
}

.game-view__left {
    display: grid;
    gap: 1rem;
}

.game-data {
    display: grid;
    grid-template-columns: 1fr 30%;
    gap: 1rem;
}

.game-data__mobile {
    display: none;
}

.game-view__right {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: 2rem;
}

/* MOBILE DESIGN */
@media (max-width: 1080px) {
    .game-view__body {
        grid-template-columns: 1fr;
    }

    .game-data {
        grid-template-columns: 1fr;
    }

    .game-data__desktop {
        display: none;
    }

    .game-data__mobile {
        display: grid;
        grid-template-columns: 1.25fr 0.75fr;
        gap: 1rem;
    }
}
</style>