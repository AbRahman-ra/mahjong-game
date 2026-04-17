<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/client/store/gameStore';
import { GamePhase } from '@/server/core/domain/model/GameState';

const router = useRouter();
const gameStore = useGameStore();

watch(
    () => gameStore.phase,
    (phase) => {
        if (phase === GamePhase.GAME_OVER) {
            router.push({ name: 'end' });
        }
    }
);
</script>

<template>
    <main class="app-shell">
        <div class="ambient ambient-left" />
        <div class="ambient ambient-right" />

        <RouterView v-slot="{ Component }">
            <Transition name="screen-fade" mode="out-in">
                <component :is="Component" />
            </Transition>
        </RouterView>
    </main>
</template>