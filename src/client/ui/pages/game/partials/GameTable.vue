<script setup lang="ts">
import DrawPile from '@/client/ui/pages/game/partials/DrawPile.vue';
import DiscardPile from '@/client/ui/pages/game/partials/DiscardPile.vue';
import { computed, ref } from 'vue';

const discardPileRef = ref<InstanceType<typeof DiscardPile> | null>(null);
const drawPileRef = ref<InstanceType<typeof DrawPile> | null>(null);

defineExpose({
    discardedPilesArea: computed(() => discardPileRef.value?.discardedPilesArea ?? null),
    discardedPilesRect: computed(() => discardPileRef.value?.discardedPilesRect ?? null),
    drawPileWrapper: computed(() => drawPileRef.value?.stackRef ?? null),
});

</script>

<template>
    <section class="game-table panel">
        <DiscardPile ref="discardPileRef" />
        <DrawPile ref="drawPileRef" />
    </section>
</template>

<style scoped>
.game-table {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
    min-height: 18rem;
    align-items: stretch;
}
</style>