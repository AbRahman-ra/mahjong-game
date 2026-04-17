<script setup lang="ts">
import LeaveIcon from "@/client/icons/LeaveIcon.vue"

defineEmits<{
    exit: [];
}>();
</script>

<template>
    <button class="icon-btn btn-wrapper" @click="$emit('exit')">
        <LeaveIcon />
    </button>
</template>

<style scoped>
.btn-wrapper {
    width: 2rem;
    fill: var(--rose)
}
</style>