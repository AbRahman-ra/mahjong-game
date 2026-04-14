export interface GameEvent<T> {
    type: GameEventType,
    data: T
}

export enum GameEventType {
    GAME_OVER = "GAME_OVER",
    PILE_OUTAGE = "PILE_OUTAGE",
    SUCCESSFUL_BET = "SUCCESSFUL_BET",
    UNSUCCESSFUL_BET = "UNSUCCESSFUL_BET",
}