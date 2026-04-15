<script setup lang="ts">
import * as Settings from '@/server/core/domain/config/Settings';

defineEmits<{
    start: [];
}>();
</script>

<template>
    <section class="landing-hero panel panel-accent">
        <p class="eyebrow">Penny Software Assessment</p>
        <h1>Mahjong Hand Betting Game</h1>

        <p class="landing-hero__lead">
            Read the table, trust your call, and survive the honor tile
            swings before the deck burns out.
        </p>

        <ul class="landing-hero__stats">
            <li>
                <span class="stat-label">Deck</span>
                <strong>{{ Settings.DECK_SIZE }} tiles</strong>
            </li>
            <li>
                <span class="stat-label">Hand Size</span>
                <strong>{{ Settings.HAND_SIZE }} tiles</strong>
            </li>
            <li>
                <span class="stat-label">Fail State</span>
                <strong>{{ Settings.GAME_OVER_CONDITIONS.RESHUFFLES_MAX }} reshuffles</strong>
                <strong>Any tile drop to {{ Settings.GAME_OVER_CONDITIONS.TILE_MIN }}</strong>
                <strong>Any tile rise to {{ Settings.GAME_OVER_CONDITIONS.TILE_MAX }}</strong>
            </li>
        </ul>

        <button class="button" @click="$emit('start')">
            Start New Game
        </button>
    </section>
</template>

<style scoped>
.landing-hero {
    display: grid;
    gap: 1.5rem;
    align-content: center;
}

.landing-hero h1 {
    max-width: 12ch;
    font-size: clamp(2.6rem, 6vw, 5.2rem);
    line-height: 0.95;
}

.landing-hero__lead {
    max-width: 44rem;
    font-size: 1.12rem;
    color: var(--ink-soft);
}

.landing-hero__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.8rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.landing-hero__stats li {
    display: grid;
    gap: 0.45rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgba(17, 31, 43, 0.24);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-label {
    color: var(--ink-soft);
    font-size: 0.84rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1rem;
}

@media (max-width: 640px) {
    .landing-hero__stats {
        grid-template-columns: 1fr;
    }
}
</style>