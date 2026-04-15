<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../store/gameStore'

const gameStore = useGameStore()
const { score, drawPile, discardPile, reshuffleCount } = storeToRefs(gameStore)

const showExitConfirm = ref(false)

</script>

<template>
    <section class="game-view layout-shell">
        <header class="game-view__topbar panel">
            <div>
                <p class="eyebrow">Live Run</p>
                <h2>Score {{ score }}</h2>
            </div>

            <div class="game-view__topbar-actions">
                <div class="counter-card">
                    <span>Draw pile</span>
                    <strong>{{ drawPile.length }}</strong>
                </div>
                <div class="counter-card">
                    <span>Discard pile</span>
                    <strong>{{ discardPile.length }}</strong>
                </div>
                <div class="counter-card">
                    <span>Reshuffles</span>
                    <strong>{{ reshuffleCount }}/3</strong>
                </div>
                <button class="button button-ghost" @click="showExitConfirm = true">
                    Exit Game
                </button>
            </div>
        </header>
    </section>
</template>