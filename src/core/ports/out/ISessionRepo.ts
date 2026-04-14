export interface ISessionRepo {
    savePlayerName(name: string): Promise<void>;
    getPlayerName(): Promise<string | null>;
    clear(): Promise<void>;
}
