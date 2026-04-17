<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/client/store/gameStore';

import GameTopbar from '@/client/pages/game/partials/Topbar.vue';
import GameTable from '@/client/pages/game/partials/GameTable.vue';
import GameData from '@/client/pages/game/partials/GameData.vue';
import HandHistory from '@/client/pages/game/partials/HandHistory.vue';
import ExitConfirmDialog from '@/client/pages/game/partials/ExitConfirmDialog.vue';
import ResolutionBanner from './partials/ResolutionBanner.vue';

const router = useRouter();
const gameStore = useGameStore();

const showExitConfirm = ref(false);

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
                <GameTable />
                <GameData />
            </div>

            <div class="game-view__right">
                <ResolutionBanner />
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
}
</style>