// bootstrap/local.ts
export function buildContainer(): IGameService {
    const repo = new InMemoryGameRepo();
    const bus = new LocalEventBus();
    const engine = new GameEngine();
    return new PlaceBetService(engine, bus, repo); // implements IGameService
}
