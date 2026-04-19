import * as BET from "../domain/model/Bet";
import { GamePhase, GameState } from "../domain/model/GameState";
import { IPlaceBetService } from "../ports/in/IGameService";
import { IGameRepo } from "../ports/out/IGameRepo";
import { IGameEventBus } from "../ports/out/IGameEventBus";
import * as GEVENT from "../domain/events/Event";
import * as ENGINE from "../engine/GameEngine";

export class PlaceBet implements IPlaceBetService {
    constructor(
        private readonly repo: IGameRepo,
        private readonly eventBus: IGameEventBus,
    ) {}

    async drawNextHand(bet: BET.BetDirection): Promise<GameState> {
        const state = await this.repo.load();
        if (!state) throw new Error("No active game session");

        const afterBetState = ENGINE.placeBet(state, bet);

        // game over on reshuffle limit
        if (ENGINE.isGameOver(afterBetState)) {
            await this.repo.save(afterBetState);
            this.eventBus.publish({
                type: GEVENT.GameEventType.GAME_OVER,
                data: {
                    reason: afterBetState.gameOverReason!,
                    lastScore: afterBetState.score,
                },
            });
            return afterBetState;
        }

        // notify reshuffle
        if (afterBetState.reshuffleCount > state.reshuffleCount) {
            this.eventBus.publish({
                type: GEVENT.GameEventType.PILE_OUTAGE,
                data: {
                    remaining: afterBetState.drawPile.length,
                    reshuffles: afterBetState.reshuffleCount,
                },
            });
        }

        await this.repo.save(afterBetState);
        return afterBetState;
    }

    async resolveBet(): Promise<GameState> {
        const state = await this.repo.load();
        if (!state) throw new Error("No active game session");

        const afterResolveState = ENGINE.resolveBet(state);
        await this.repo.save(afterResolveState);

        const lastRecord = afterResolveState.history.at(-1)!;
        this.eventBus.publish({
            type:
                lastRecord.outcome === BET.BetOutcome.WIN
                    ? GEVENT.GameEventType.SUCCESSFUL_BET
                    : GEVENT.GameEventType.UNSUCCESSFUL_BET,
            data: {
                hand: lastRecord.hand,
                scoreChange: lastRecord.scoreChange,
            },
        });

        if (ENGINE.isGameOver(afterResolveState)) {
            this.eventBus.publish({
                type: GEVENT.GameEventType.GAME_OVER,
                data: {
                    reason: afterResolveState.gameOverReason!,
                    lastScore: afterResolveState.score,
                },
            });
        }

        return afterResolveState;
    }
}
