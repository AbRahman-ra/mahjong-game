// client/store/gameStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { gameService, eventBus } from "@/server/bootstrap/local";
import { GameEventType } from "@/server/core/domain/events/Event";
import { GamePhase } from "@/server/core/domain/model/GameState";
import { BetDirection } from "@/server/core/domain/model/Bet";
import type { GameState } from "@/server/core/domain/model/GameState";
import type { GameEvent } from "@/server/core/domain/events/Event";

export const useGameStore = defineStore("game", () => {

    // ================================= STATE =================================
    const gameState = ref<GameState | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // ================================= Getters =================================
    const phase = computed(() => gameState.value?.phase);
    const score = computed(() => gameState.value?.score ?? 0);
    const currentHand = computed(() => gameState.value?.currentHand);
    const nextHand = computed(() => gameState.value?.nextHand);
    const drawPile = computed(() => gameState.value?.drawPile ?? []);
    const discardPile = computed(() => gameState.value?.discardPile ?? []);
    const history = computed(() => gameState.value?.history ?? []);
    const honorValues = computed(() => gameState.value?.honorValues);
    const reshuffleCount = computed(() => gameState.value?.reshuffleCount ?? 0);
    const gameOverReason = computed(() => gameState.value?.gameOverReason);
    const isGameOver = computed(() => phase.value === GamePhase.GAME_OVER);
    const isBetting = computed(() => phase.value === GamePhase.BETTING);
    const isRevealing = computed(() => phase.value === GamePhase.REVEALING);

    // ================================= Actions =================================
    async function initGame(): Promise<void> {
        isLoading.value = true;
        error.value = null;
        try {
            gameState.value = await gameService.initGame();
        } catch (e) {
            error.value = "Failed to initialize game";
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }

    async function placeBet(bet: BetDirection): Promise<void> {
        if (!isBetting.value) return;
        isLoading.value = true;
        error.value = null;
        try {
            gameState.value = await gameService.placeBet(bet);
        } catch (e) {
            error.value = "Failed to place bet";
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }

    async function exitGame(playerName: string, saveScore: boolean): Promise<void> {
        isLoading.value = true;
        error.value = null;
        try {
            await gameService.exitGame(playerName, saveScore);
            gameState.value = null;
        } catch (e) {
            error.value = "Failed to exit game";
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }

    // ================================= Event bus =================================
    // subscribed once at store creation — lives for the app lifetime

    function handleGameEvent(event: GameEvent<unknown>): void {
        switch (event.type) {
            case GameEventType.GAME_OVER:
                // gameState already updated by placeBet — nothing extra needed here
                // uiStore will handle navigation
                break;
            case GameEventType.PILE_OUTAGE:
                // uiStore handles the notification
                break;
            case GameEventType.SUCCESSFUL_BET:
            case GameEventType.UNSUCCESSFUL_BET:
                // uiStore handles animations
                break;
        }
    }

    eventBus.subscribe(handleGameEvent);

    return {
        // state
        gameState,
        isLoading,
        error,
        // getters
        phase,
        score,
        currentHand,
        nextHand,
        drawPile,
        discardPile,
        history,
        honorValues,
        reshuffleCount,
        gameOverReason,
        isGameOver,
        isBetting,
        isRevealing,
        // actions
        initGame,
        placeBet,
        exitGame,
    };
});
