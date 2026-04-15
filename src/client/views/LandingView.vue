<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Leaderboard from '@/client/components/Leaderboard.vue';
import LandingViewHeroPanel from '@/client/views/partials/LandingViewHeroPanel.vue';
import { useGameStore } from '@/client/store/gameStore';
import { useLeaderboardStore } from '@/client/store/leaderboardStore';

const router = useRouter();
const gameStore = useGameStore();
const leaderboardStore = useLeaderboardStore();

const { entries, isLoading } = storeToRefs(leaderboardStore);

// onMounted(() => leaderboardStore.fetchTop());

async function startNewGame() {
    await gameStore.initGame();
    router.push({ name: 'game' });
}
</script>

<template>
    <section class="landing-view layout-shell">

        <!-- Hero panel -->
        <LandingViewHeroPanel @start="startNewGame" />

        <!-- Leaderboard -->
        <Leaderboard :entries="entries" :is-loading="isLoading" />

    </section>
</template>

<style scoped>
.landing-view {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(20rem, 0.9fr);
    gap: 1.5rem;
    align-items: stretch;
}

@media (max-width: 960px) {
    .landing-view {
        grid-template-columns: 1fr;
    }
}
</style>