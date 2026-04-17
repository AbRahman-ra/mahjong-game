<script setup lang="ts">
import { computed } from 'vue';
import { isNumberTile } from '@/server/core/domain/model/Tile';
import { TileLabelFormat } from '@/server/core/domain/model/TileLabel';
import { NonNumberTileGroup } from '@/server/core/domain/model/TileGroup';
import * as Settings from '@/server/core/domain/config/Settings';
import type { Tile } from '@/server/core/domain/model/Tile';

const props = withDefaults(defineProps<{
    tile: Tile;
    honorValues: Readonly<Record<NonNumberTileGroup, number>>;
    compact?: boolean;
    highlight?: boolean;
}>(), {
    compact: false,
    highlight: false,
});

const group = computed(() => Settings.TILE_GROUPS[props.tile.type]);
const accent = computed(() => group.value.accent);
const displayValue = computed(() =>
    isNumberTile(props.tile)
        ? props.tile.value.value
        : props.honorValues[props.tile.type]
);
const label = computed(() =>
    isNumberTile(props.tile)
        ? props.tile.value.label
        : props.tile.label
);
const isImage = computed(() => label.value.format === TileLabelFormat.IMAGE_URL);
</script>

<template>
    <article class="tile-card" :class="{
        'tile-card--compact': compact,
        'tile-card--highlight': highlight,
        'tile-card--honor': !isNumberTile(tile),
    }" :style="{ '--tile-accent': accent }">
        <!-- Top row: group label + current value -->
        <header class="tile-card__top">
            <section class="tile-card__group">
                <img :alt="`${group.type} tile group`" v-if="group.label.format === TileLabelFormat.IMAGE_URL"
                    :src="group.label.value" class="tile-card__group-img" />
                <strong v-else>{{ group.label.value }}</strong>
            </section>
            <span class="tile-card__value">{{ displayValue }}</span>
        </header>

        <!-- Face: tile's own label -->
        <section class="tile-card__face">
            <img :alt="`${group.type} tile`" v-if="isImage" :src="label.value" class="tile-card__face-img" />
            <strong v-else class="tile-card__rank">{{ label.value }}</strong>
        </section>

        <!-- Footer: tile type -->
        <footer class="tile-card__footer">
            <span>{{ tile.type }}</span>
        </footer>
    </article>
</template>

<style scoped>
.tile-card {
    container-type: inline-size;
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 0.7rem;
    aspect-ratio: 2 / 3;
    padding: 0.85rem;
    border-radius: 1.15rem;
    border: 1px solid color-mix(in srgb, var(--tile-accent) 30%, rgba(255, 255, 255, 0.35));
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 241, 228, 0.98)),
        linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.18));
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        0 18px 30px rgba(14, 23, 38, 0.15);
    transform-origin: center bottom;
    animation: tile-in 380ms ease both;
}

.tile-card::after {
    content: '';
    position: absolute;
    inset: 0.5rem;
    border-radius: 0.8rem;
    border: 1px solid color-mix(in srgb, var(--tile-accent) 16%, transparent);
    pointer-events: none;
}

.tile-card--compact {
    gap: 0.35rem;
    padding: 0.65rem;
}

.tile-card--highlight {
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        0 0 0 2px color-mix(in srgb, var(--tile-accent) 25%, transparent),
        0 18px 34px color-mix(in srgb, var(--tile-accent) 22%, transparent);
}

/* TOP ROW */
.tile-card__top,
.tile-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--tile-accent) 70%, #333);
}

.tile-card__top {
    font-size: clamp(0.55rem, 25cqi, 0.8rem);
}

.tile-card__footer {
    font-size: clamp(0.55rem, 10cqi, 0.8rem);
}

.tile-card__value {
    display: inline-flex;
    min-width: 1.9rem;
    justify-content: center;
    padding: 0.25rem 0.45rem;
    border-radius: 100%;
    background: color-mix(in srgb, var(--tile-accent) 14%, white);
    color: color-mix(in srgb, var(--tile-accent) 70%, var(--ink));
    font-size: clamp(0.55rem, 3cqi, 0.8rem);
    font-weight: 700;
}

/* BODY */
.tile-card__face {
    flex: 1;
    display: grid;
    place-items: center;
    min-height: unset;
    border-radius: 15%;
    background:
        radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--tile-accent) 22%, white), transparent 45%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(246, 240, 231, 0.92));
    border: 1px solid rgba(17, 31, 43, 0.08);
}

.tile-card__rank {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1rem, 50cqi, 3rem);
    line-height: 1;
    color: color-mix(in srgb, var(--tile-accent) 68%, #111);
}

.tile-card__face-img,
.tile-card__group-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* ANIMATIONS */

@keyframes tile-in {
    from {
        opacity: 0;
        transform: translateY(20px) rotateX(28deg);
    }

    to {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
    }
}
</style>