import { ISessionRepo } from "../../core/ports/out/ISessionRepo";

const SESSION_KEY = "player_session";

export class LocalStorageSessionRepo implements ISessionRepo {
    async savePlayerName(name: string): Promise<void> {
        localStorage.setItem(SESSION_KEY, name);
    }

    async getPlayerName(): Promise<string | null> {
        return localStorage.getItem(SESSION_KEY);
    }

    async clear(): Promise<void> {
        localStorage.removeItem(SESSION_KEY);
    }
}
