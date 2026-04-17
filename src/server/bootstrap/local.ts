// SIMPLE DI SCRIPT
import { LocalStorageGameRepo } from "../adapters/local/LocalStorageGameRepo";
import { LocalStorageLeaderboardRepo } from "../adapters/local/LocalStorageLeaderboardRepo";
import { LocalStorageSessionRepo } from "../adapters/local/LocalStorageSessionRepo";
import { LocalEventBus } from "../adapters/local/LocalEventBus";
import { InitGame } from "../core/usecases/InitGame";
import { PlaceBet } from "../core/usecases/PlaceBet";
import { ExitGame } from "../core/usecases/ExitGame";
import { IGameService } from "../core/ports/in/IGameService";
import { ILeaderboardService } from "../core/ports/in/ILeaderboardService";
import { GetLeaderboard } from "../core/usecases/GetLeaderboard";

// ADAPTERS
const gameRepo = new LocalStorageGameRepo();
const leaderboardRepo = new LocalStorageLeaderboardRepo();
const sessionRepo = new LocalStorageSessionRepo();
const eventBus = new LocalEventBus();

// USECASES
const initGame = new InitGame(gameRepo);
const placeBet = new PlaceBet(gameRepo, eventBus);
const exitGame = new ExitGame(gameRepo, leaderboardRepo);
const leaderboard = new GetLeaderboard(leaderboardRepo);

export const gameService: IGameService = {
    initGame: initGame.initGame.bind(initGame),
    placeBet: placeBet.placeBet.bind(placeBet),
    exitGame: exitGame.exitGame.bind(exitGame),
};

export const leaderboardService: ILeaderboardService = {
    getTop: leaderboard.getTop.bind(leaderboard),
};

export { eventBus, sessionRepo };
