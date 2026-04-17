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
            <GameTable />
            <GameData />
            <ResolutionBanner />
            <HandHistory />
            <div class="game-view__main">
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
    grid-template-columns: minmax(0, 1.2fr) minmax(22rem, 0.8fr);
    gap: 1.35rem;
    align-items: start;
}

.game-view__main {
    display: grid;
    gap: 1rem;
}

@media (max-width: 1080px) {
    .game-view__body {
        grid-template-columns: 1fr;
    }
}
</style>