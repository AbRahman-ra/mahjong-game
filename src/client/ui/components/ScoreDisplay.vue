<script setup lang="ts">
withDefaults(defineProps<{
    score: number;
    color?: string;
}>(), {
    color: "var(--gold)"
});
</script>

<template>
    <div class="score-display" :style="{ '--score-color': color }">
        <p class="eyebrow">Score</p>
        <strong class="score-display__value">{{ score }}</strong>
    </div>
</template>

<style scoped>
.score-display {
    display: grid;
    gap: 0.2rem;
}

.score-display__value {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    line-height: 1;
    color: var(--score-color);
}
</style>