import { GameEvent } from "../../domain/events/Event";

export interface IGameEventBus {
    publish<T>(event: GameEvent<T>): void;
    subscribe<T>(handler: (event: GameEvent<T>) => void): void;
    unsubscribe<T>(handler: (event: GameEvent<T>) => void): void;
}