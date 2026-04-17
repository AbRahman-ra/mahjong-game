<!-- client/views/partials/GameTable.vue -->
<script setup lang="ts">
import DrawPile from '@/client/ui/pages/game/partials/DrawPile.vue';
import DiscardPile from '@/client/ui/pages/game/partials/DiscardPile.vue';
</script>

<template>
    <section class="game-table panel">
        <DiscardPile />
        <DrawPile />
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