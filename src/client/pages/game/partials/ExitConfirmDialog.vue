<script setup lang="ts">
defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    confirm: [];
    cancel: [];
}>();
</script>

<template>
    <Transition name="screen-fade">
        <div v-if="show" class="confirm-overlay" @click.self="emit('cancel')">
            <div class="confirm-dialog panel">
                <p class="eyebrow">Leave Session</p>
                <h3>Return to the landing page?</h3>
                <p class="confirm-dialog__sub">
                    Your current run will be abandoned.
                </p>
                <div class="confirm-dialog__actions">
                    <button class="button button-ghost" @click="emit('cancel')">
                        Keep Playing
                    </button>
                    <button class="button button-secondary" @click="emit('confirm')">
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.confirm-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background: rgba(4, 10, 18, 0.72);
    backdrop-filter: blur(8px);
    z-index: 200;
}

.confirm-dialog {
    width: min(100%, 28rem);
    display: grid;
    gap: 0.9rem;
}

.confirm-dialog__sub {
    color: var(--ink-soft);
    font-size: 0.95rem;
}

.confirm-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
}

@media (max-width: 720px) {
    .confirm-dialog__actions {
        flex-direction: column-reverse;
    }
}
</style>