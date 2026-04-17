<script setup lang="ts">
defineEmits<{
    exit: [];
}>();
</script>

<template>
    <button class="button button-ghost" @click="$emit('exit')">
        Exit
    </button>
</template>