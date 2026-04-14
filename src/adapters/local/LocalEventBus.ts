import { IGameEventBus } from "../../core/ports/out/IGameEventBus";
import { GameEvent } from "../../core/domain/events/Event";

export class LocalEventBus implements IGameEventBus {
    private handlers = new Set<(event: GameEvent<unknown>) => void>();

    publish<T>(event: GameEvent<T>): void {
        this.handlers.forEach((h: (event: GameEvent<unknown>) => void) => h(event as GameEvent<unknown>));
    }

    subscribe<T>(handler: (event: GameEvent<T>) => void): void {
        this.handlers.add(handler as (event: GameEvent<unknown>) => void);
    }

    unsubscribe<T>(handler: (event: GameEvent<T>) => void): void {
        this.handlers.delete(handler as (event: GameEvent<unknown>) => void);
    }
}
