<script setup lang="ts">
import { ref } from 'vue';
import DownArrow from "@/client/icons/DownArrow.vue";

const emit = defineEmits<{ expanded: [value: boolean] }>();

const isFlipped = ref(false);

const toggle = () => {
    isFlipped.value = !isFlipped.value;
    emit("expanded", isFlipped.value);
};

</script>

<template>
    <button class="icon-btn" @click="toggle">
        <DownArrow :class="{ '-flipped-': isFlipped }" />
    </button>
</template>

<style scoped>
svg {
    transition: transform 0.4s ease;
}

.-flipped- {
    transform: rotate(180deg);
}
</style>