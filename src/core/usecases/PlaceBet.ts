// core/usecases/PlaceBet.ts
export class PlaceBet {
    constructor(
        private engine: GameEngine,
        private eventBus: IGameEventBus,
        private gameRepo: IGameRepo, // <-- driven port
    ) {}

    async execute(state: GameState, bet: BetDirection): Promise<GameState> {
        const next = this.engine.resolveBet(state, bet);
        await this.gameRepo.save(next); // persist
        this.eventBus.publish(new BetResolved(next));
        return next;
    }
}
