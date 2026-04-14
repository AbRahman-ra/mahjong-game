import * as BET from "../domain/model/Bet";
import { GameState } from "../domain/model/GameState";
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

    async placeBet(bet: BET.BetDirection): Promise<GameState> {
        const state = await this.repo.load();
        if (!state) throw new Error("No active game session");

        // change state
        const afterBetState = ENGINE.placeBet(state, bet);

        // if game over
        if (ENGINE.isGameOver(afterBetState)) {
            let reason = afterBetState.gameOverReason!;
            let lastScore = afterBetState.score;

            await this.repo.save(afterBetState);
            let event: GEVENT.GameEvent<GEVENT.GameOverContext> = {
                type: GEVENT.GameEventType.GAME_OVER,
                data: { reason, lastScore },
            };

            this.eventBus.publish(event);
            return afterBetState;
        }

        // if reshuffled
        const isReshuffled = afterBetState.reshuffleCount > state.reshuffleCount;

        if (isReshuffled) {
            let remaining = afterBetState.drawPile.length;
            let reshuffles = afterBetState.reshuffleCount;

            let event: GEVENT.GameEvent<GEVENT.PileOutageContext> = {
                type: GEVENT.GameEventType.PILE_OUTAGE,
                data: { remaining, reshuffles },
            };
            this.eventBus.publish(event);
        }

        // resolve new state
        const afterResolveState = ENGINE.resolveBet(afterBetState);
        await this.repo.save(afterResolveState);

        // publish resolved bet
        const lastRecord = afterResolveState.history[afterResolveState.history.length - 1];
        const type = lastRecord.outcome === BET.BetOutcome.WIN ? GEVENT.GameEventType.SUCCESSFUL_BET : GEVENT.GameEventType.UNSUCCESSFUL_BET;
        let { hand, scoreChange } = lastRecord;
        let resolveEvent: GEVENT.GameEvent<GEVENT.BetResolvedContext> = {type, data: { hand, scoreChange }}
        this.eventBus.publish(resolveEvent);

        if (ENGINE.isGameOver(afterResolveState)) {
            const reason = afterResolveState.gameOverReason!;
            const lastScore = afterResolveState.score;
            let event: GEVENT.GameEvent<GEVENT.GameOverContext> = {
                type: GEVENT.GameEventType.GAME_OVER,
                data: { reason, lastScore }
            };

            this.eventBus.publish(event);
        }

        return afterResolveState;
    }
}
