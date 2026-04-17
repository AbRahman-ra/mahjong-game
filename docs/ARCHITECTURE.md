# Hand Betting Game — Architecture Reference

## Note: This document is fully generated with AI

> A complete guide to the codebase structure, layer responsibilities, and dependency rules.
> Written to be re-read before onsite interviews or feature additions.

---

## Table of Contents

1. [Big Picture](#1-big-picture)
2. [The Golden Rule](#2-the-golden-rule)
3. [Layer-by-Layer Breakdown](#3-layer-by-layer-breakdown-srcserver)
    - [Domain Model](#31-domain-model-coredomainmodel)
    - [Engine](#32-engine-coreengine)
    - [Ports](#33-ports-coreports)
    - [Use Cases](#34-use-cases-coreusecases)
    - [Adapters](#35-adapters-adapters)
    - [Bootstrap](#36-bootstrap-bootstrap)
4. [Vue Store & UI](#4-vue-store--ui-srcclient)
5. [Dependency Direction](#5-dependency-direction)
6. [Data Flow — A Full Round Trip](#6-data-flow--a-full-round-trip)
7. [Event Bus](#7-event-bus)
8. [Key Design Decisions & Why](#8-key-design-decisions--why)
9. [How to Add New Features](#9-how-to-add-new-features)
10. [File Reference](#10-file-reference)

---

## 1. Big Picture

The project follows **Hexagonal Architecture** (Ports & Adapters), also known as Clean Architecture.

The core idea is simple:

```
┌─────────────────────────────────────────────────────────┐
│                        Vue UI                           │
│                     (store, views)                      │
├─────────────────────────────────────────────────────────┤
│                    Ports (in/out)                       │
│              IGameService, IGameRepo, ...               │
├─────────────────────────────────────────────────────────┤
│                     Use Cases                           │
│            InitGame, PlaceBet, ExitGame                 │
├─────────────────────────────────────────────────────────┤
│                      Engine                             │
│      BetsManager, GameOverChecker, HonorScaler          │
├─────────────────────────────────────────────────────────┤
│                    Domain Model                         │
│         Tile, Hand, Deck, GameState, Settings           │
└─────────────────────────────────────────────────────────┘
         ↑ Dependencies only point INWARD ↑
```

The **inner layers never know about the outer layers**.
`GameState` has no idea Vue exists. `BetsManager` has no idea localStorage exists.

---

## 2. The Golden Rule

```
╔══════════════════════════════════════════════════════════╗
║  DEPENDENCY RULE                                         ║
║                                                          ║
║  Source code dependencies ONLY point inward.             ║
║                                                          ║
║  Outer layers import from inner layers.                  ║
║  Inner layers NEVER import from outer layers.            ║
╚══════════════════════════════════════════════════════════╝
```

### What this means in practice

| This import...                                              | Is...                        |
| ----------------------------------------------------------- | ---------------------------- |
| `usecase/PlaceBet.ts` → `domain/model/GameState.ts`         | ✅ Allowed (outer → inner)   |
| `engine/BetsManager.ts` → `domain/model/Tile.ts`            | ✅ Allowed (outer → inner)   |
| `domain/model/Hand.ts` → `engine/BetsManager.ts`            | ❌ FORBIDDEN (inner → outer) |
| `domain/model/Tile.ts` → `store/gameStore.ts`               | ❌ FORBIDDEN (inner → outer) |
| `engine/GameEngine.ts` → `adapters/LocalStorageGameRepo.ts` | ❌ FORBIDDEN (inner → outer) |

---

## 3. Layer-by-Layer Breakdown (`src/server/`)

### 3.1 Domain Model (`core/domain/model/`)

- **What it is:** Pure data. No logic beyond simple transformations.
- **Depends on:** Nothing. Zero imports from any other layer.
- **Used by:** Engine, Use Cases, Ports.

```
core/domain/model/
├── Tile.ts              # Tile union type (NumberTile | NonNumberTile)
├── TileGroup.ts         # NumberTileGroup, NonNumberTileGroup enums
├── Deck.ts              # Deck type + newDeck() + draw()
├── Hand.ts              # Hand interface + newHand() factory
├── GameState.ts         # GameState, GamePhase, GameOverReason, BetOutcome
├── GameHistoryRecord.ts # One resolved round's record
├── Bet.ts               # BetDirection, BetOutcome enums
├── Leaderboard.ts       # LeaderboardEntry interface
└── NumberTileValues.ts  # Possible number tile values per group
```

#### Key types

```typescript
// A tile is EITHER a number tile OR a non-number tile
type Tile = NumberTile | NonNumberTile;

// Number tiles carry their value directly
interface NumberTile {
    type: NumberTileGroup; // MAN, PIN, SOU
    value: SinglePositiveDigit; // 1–9, fixed forever
}

// Non-number tiles carry NO value — value lives in GameState.honorValues
interface NonNumberTile {
    type: NonNumberTileGroup; // WIND, DRAGON
}

// GameState is the single source of truth — fully serializable plain object
interface GameState {
    phase: GamePhase;
    score: number;
    reshuffleCount: number;
    drawPile: Deck;
    discardPile: Tile[];
    currentHand: Hand;
    nextHand?: Hand | null;
    history: GameHistoryRecord[];
    honorValues: Record<NonNumberTileGroup, number>; // dynamic scaling lives here
    gameOverReason?: GameOverReason;
    currentBet?: BetDirection;
}
```

#### Why `honorValues` lives in `GameState`, not on `NonNumberTile`

All 4 physical copies of WIND share the same current value. If value lived on the tile instance, you'd need to keep 4 copies in sync across the draw pile, discard pile, and current hand simultaneously. With `GameState.honorValues`, there is **one source of truth**.

```
// ❌ Problematic: which copy's value do you trust?
{ type: WIND, value: 6 }  ← copy 1 in draw pile
{ type: WIND, value: 6 }  ← copy 2 in discard pile
{ type: WIND, value: 7 }  ← copy 3 in hand (just won) ← out of sync!

// ✅ Correct: one record, all copies read from it
GameState.honorValues = { WIND: 6, DRAGON: 5 }
resolveTileValue(tile, honorValues) → always consistent
```

---

### 3.2 Engine (`core/engine/`)

- **What it is:** Pure functions that transform `GameState → GameState`. No side effects, no async, no external dependencies.
- **Depends on:** Domain Model + Config only.
- **Used by:** Use Cases (via the `GameEngine.ts` facade).

```
core/engine/
├── GameEngine.ts              # Facade — single entry point for use cases
├── GameInitializer.ts         # initGame() → fresh GameState
├── BetsManager.ts             # placeBet() + resolveBet()
├── GameOverChecker.ts         # isGameOver() + isReshuffleLimitReached()
└── HonorValuesDynamicScaler.ts # scaleHonorValues()
```

#### The Facade pattern (`GameEngine.ts`)

Use cases import only `GameEngine.ts`, never the individual engine files directly. This means you can refactor internals (split `BetsManager` further, rename files) without touching use cases.

```typescript
// GameEngine.ts — what use cases see
export const placeBet = (state, bet) => BetsManager.placeBet(state, bet);
export const resolveBet = (state) => BetsManager.resolveBet(state);
export const isGameOver = (state) => GameOverChecker.isGameOver(state);
```

#### Engine functions are pure

```
placeBet(state, bet) → newState    // never mutates state
resolveBet(state)    → newState    // always returns a new object
isGameOver(state)    → reason | undefined
```

This makes them trivially testable — no mocks, no setup, just pass in state and assert output.

#### Bet resolution flow

```
placeBet(state, bet)
    │
    ├── Draw pile empty?
    │   ├── Yes + reshuffle limit reached → GAME_OVER (RESHUFFLE_LIMIT)
    │   └── Yes + limit not reached → reshuffle (combine discard + fresh deck)
    │
    └── Draw next hand → transition to REVEALING phase

resolveBet(state)
    │
    ├── Compare currentHand.total vs nextHand.total
    ├── Determine WIN / LOSE (tie = LOSE)
    ├── Update score (floor: MIN_POSSIBLE_SCORE)
    ├── Scale honor values (WIN: +1, LOSE: -1 per NonNumberTile in hand)
    ├── Check game over (honor value bounds)
    └── Build GameHistoryRecord → transition to BETTING phase
```

---

### 3.3 Ports (`core/ports/`)

- **What it is:** Interfaces only. No implementation. The contracts between core and the outside world.
- **Depends on:** Domain Model only.

```
core/ports/
├── in/                    # Driving ports — outside world calls core
│   ├── IGameService.ts    # initGame, placeBet, exitGame
│   └── ILeaderboardService.ts
└── out/                   # Driven ports — core calls outside world
    ├── IGameRepo.ts       # save, load, clear
    ├── ILeaderboardRepo.ts # save, getTop
    ├── IGameEventBus.ts   # publish, subscribe, unsubscribe
    └── ISessionRepo.ts    # savePlayerName, getPlayerName, clear
```

#### Driving vs Driven ports

```
                    ┌─────────────────────┐
                    │      CORE           │
  Vue Store         │                     │         localStorage
  calls             │  ports/in/          │         implements
  ────────────────▶│  IGameService       │         ports/out/
                    │                     │◀─────────IGameRepo
                    │  Use Cases call     │
                    │  ports/out/         │
                    │  IGameRepo ─────────│─────────▶ LocalStorageGameRepo
                    └─────────────────────┘
```

- **`ports/in/`** = "driving" — the UI drives the core by calling these.
- **`ports/out/`** = "driven" — the core drives the adapters by calling these.

#### Why interfaces instead of direct calls

```typescript
// ❌ Without ports — use case knows about localStorage
import { LocalStorageGameRepo } from "../../adapters/local/LocalStorageGameRepo";
const repo = new LocalStorageGameRepo();

// ✅ With ports — use case knows only the contract
constructor(private readonly repo: IGameRepo) {}
// What implements IGameRepo? The use case doesn't know or care.
```

Swapping localStorage for an HTTP API = swap the adapter, zero core changes.

---

### 3.4 Use Cases (`core/usecases/`)

- **What it is:** Orchestrators. They wire engine calls + port calls + event publishing for one user action each.
- **Depends on:** Engine (via facade), Ports (interfaces only).
- **Used by:** Bootstrap (instantiation), Vue Store (via `IGameService`).

```
core/usecases/
├── InitGame.ts      # implements IInitGameService
├── PlaceBet.ts      # implements IPlaceBetService
├── ExitGame.ts      # implements IExitGameService
└── GetLeaderboard.ts # implements ILeaderboardService
```

#### PlaceBet flow (the most complex use case)

```
placeBet(bet)
    │
    ├── 1. load state from IGameRepo
    ├── 2. ENGINE.placeBet(state, bet) → afterBetState
    │         │
    │         ├── game over? → save + publish GAME_OVER → return
    │         └── reshuffled? → publish PILE_OUTAGE
    │
    ├── 3. ENGINE.resolveBet(afterBetState) → afterResolveState
    ├── 4. save afterResolveState to IGameRepo
    ├── 5. publish SUCCESSFUL_BET or UNSUCCESSFUL_BET
    ├── 6. game over? → publish GAME_OVER
    └── 7. return afterResolveState to Vue store
```

#### Use cases never touch DOM or Vue

Use cases are plain TypeScript classes. They can run in Node.js, a test runner, or a browser — they don't know which.

---

### 3.5 Adapters (`adapters/`)

- **What it is:** Concrete implementations of `ports/out/` interfaces.
- **Depends on:** Ports (implements them), Domain Model (for types).
- **Never imported by:** Core. Only by Bootstrap.

```
adapters/
├── local/                           # localStorage implementations
│   ├── LocalStorageGameRepo.ts      # implements IGameRepo
│   ├── LocalStorageLeaderboardRepo.ts # implements ILeaderboardRepo
│   ├── LocalStorageSessionRepo.ts   # implements ISessionRepo
│   └── LocalEventBus.ts             # implements IGameEventBus
└── http/                            # future HTTP/WebSocket implementations
```

#### LocalEventBus internals

```typescript
// A Set of handlers — Set deduplicates automatically
private handlers = new Set<(event: GameEvent<unknown>) => void>();

publish<T>(event: GameEvent<T>): void {
    this.handlers.forEach(h => h(event)); // fire all subscribers
}

subscribe<T>(handler): void {
    this.handlers.add(handler); // register
}

unsubscribe<T>(handler): void {
    this.handlers.delete(handler); // deregister — prevents memory leaks
}
```

#### Why async on localStorage?

localStorage is synchronous, but `IGameRepo` methods return `Promise<>`. This means swapping to IndexedDB or an HTTP API requires **zero interface changes** — only the adapter changes.

---

### 3.6 Bootstrap (`bootstrap/`)

- **What it is:** The composition root. The only place in the codebase that knows about concrete implementations. Wires everything together once.
- **Depends on:** All layers (this is intentional — it's the wiring layer).
- **Used by:** `main.ts` / Vue app entry point.

```typescript
// bootstrap/local.ts — simplified

// 1. Instantiate adapters
const gameRepo = new LocalStorageGameRepo();
const leaderboardRepo = new LocalStorageLeaderboardRepo();
const eventBus = new LocalEventBus();

// 2. Instantiate use cases — inject adapters
const initGame = new InitGame(gameRepo);
const placeBet = new PlaceBet(gameRepo, eventBus);
const exitGame = new ExitGame(gameRepo, leaderboardRepo);

// 3. Compose into service interfaces — what Vue sees
export const gameService: IGameService = {
    initGame: initGame.initGame.bind(initGame),
    placeBet: placeBet.placeBet.bind(placeBet),
    exitGame: exitGame.exitGame.bind(exitGame),
};

export { eventBus };
```

#### Swapping to a backend

```typescript
// bootstrap/remote.ts — future
const gameRepo = new HttpGameRepo(API_URL); // implements IGameRepo
const eventBus = new WsEventBus(WS_URL); // implements IGameEventBus
// Everything else stays identical
```

Change one import line in `main.ts` or the Vue store:

```typescript
// from
import { gameService, eventBus } from "../bootstrap/local";
// to
import { gameService, eventBus } from "../bootstrap/remote";
```

Zero changes anywhere else in the codebase.

---

## 4. Vue Store & UI (`src/client/`)

- **What it is:** Reactive shell around the use cases. Holds UI state, subscribes to events, calls services.
- **Depends on:** `ports/in/` (IGameService, ILeaderboardService) + EventBus.
- **Never imports:** Engine, adapters, use case classes, domain model factories.

```typescript
// store/gameStore.ts — what it should look like
import { gameService, eventBus } from "../bootstrap/local";
import { GameEventType } from "../core/domain/events/Event";

export const useGameStore = defineStore("game", () => {
    const state = ref<GameState | null>(null);

    // call use cases
    async function initGame() {
        state.value = await gameService.initGame();
    }

    async function placeBet(bet: BetDirection) {
        state.value = await gameService.placeBet(bet);
    }

    // react to events
    onMounted(() => {
        eventBus.subscribe(handleGameEvent);
    });

    onUnmounted(() => {
        eventBus.unsubscribe(handleGameEvent); // ← prevents memory leaks
    });

    function handleGameEvent(event: GameEvent<unknown>) {
        if (event.type === GameEventType.PILE_OUTAGE) {
            // show reshuffle notification
        }
    }
});
```

---

## 5. Dependency Direction

```
                        ┌──────────────────────────────────┐
                        │         Vue Store / UI           │
                        │   (store/, views/, components/)  │
                        └──────────────┬───────────────────┘
                                       │ imports
                                       ▼
                        ┌──────────────────────────────────┐
                        │          ports/in/               │
                        │   IGameService                   │
                        │   ILeaderboardService            │
                        └──────────────┬───────────────────┘
                                       │ implemented by
                                       ▼
                        ┌──────────────────────────────────┐
                        │          usecases/               │
                        │   InitGame                       │
                        │   PlaceBet          imports      │
                        │   ExitGame    ──────────────────▶ ports/out/
                        │   GetLeaderboard                 │ IGameRepo
                        └──────────────┬───────────────────┘ IGameEventBus
                                       │ imports              ILeaderboardRepo
                                       ▼                         │
                        ┌──────────────────────────────────┐     │ implemented by
                        │           engine/                │     ▼
                        │   GameEngine (facade)            │  ┌─────────────────┐
                        │   BetsManager                    │  │   adapters/     │
                        │   GameOverChecker                │  │   local/        │
                        │   HonorValuesDynamicScaler       │  │   http/ (future)│
                        └──────────────┬───────────────────┘  └────────┬────────┘
                                       │ imports                       │
                                       ▼                               │
                        ┌──────────────────────────────────┐           │
                        │       domain/model/              │           │
                        │   Tile, Hand, Deck               │◀──────────┘
                        │   GameState, Settings            │  (adapters import
                        │   Events                         │   domain types)
                        └──────────────────────────────────┘

                        bootstrap/local.ts
                        ├── knows about ALL layers
                        ├── instantiates adapters
                        ├── injects into use cases
                        └── exports service interfaces to Vue
```

---

## 6. Data Flow — A Full Round Trip

### Player clicks "Bet Higher"

```
1. Vue component
   └── calls: gameStore.placeBet(BetDirection.HIGHER)

2. Pinia store (gameStore.ts)
   └── calls: gameService.placeBet(BetDirection.HIGHER)
               ↑ gameService is IGameService — store doesn't know the impl

3. PlaceBet use case (usecases/PlaceBet.ts)
   ├── calls: repo.load() → GameState from localStorage
   ├── calls: ENGINE.placeBet(state, HIGHER) → afterBetState
   │          ↑ pure function, no side effects
   ├── (if reshuffled) eventBus.publish(PILE_OUTAGE)
   ├── calls: ENGINE.resolveBet(afterBetState) → afterResolveState
   ├── calls: repo.save(afterResolveState) → localStorage
   ├── calls: eventBus.publish(SUCCESSFUL_BET | UNSUCCESSFUL_BET)
   ├── (if game over) eventBus.publish(GAME_OVER)
   └── returns: afterResolveState

4. Pinia store
   └── state.value = afterResolveState  ← Vue reactivity kicks in

5. Vue components re-render with new state

6. EventBus subscribers fire independently:
   ├── gameStore handler → showWinAnimation() / showLoseAnimation()
   └── (future) analytics handler → logRound()
```

---

## 7. Event Bus

The event bus decouples publishers from subscribers. A use case publishes once; any number of listeners react independently.

### Event types

| Event              | Published by | Subscribed by                               |
| ------------------ | ------------ | ------------------------------------------- |
| `GAME_OVER`        | PlaceBet     | Store (navigate to end screen), Leaderboard |
| `PILE_OUTAGE`      | PlaceBet     | Store (show reshuffle notification)         |
| `SUCCESSFUL_BET`   | PlaceBet     | Store (win animation)                       |
| `UNSUCCESSFUL_BET` | PlaceBet     | Store (lose animation)                      |

### Adding a new subscriber

```typescript
// No changes to use cases or existing subscribers needed
eventBus.subscribe((event: GameEvent<unknown>) => {
    if (event.type === GameEventType.GAME_OVER) {
        analytics.log("game_over", event.data);
    }
});
```

### Event shape

```typescript
interface GameEvent<T> {
    readonly type: GameEventType; // discriminant
    readonly data: T; // context payload
}
```

---

## 8. Key Design Decisions & Why

### GameState is a plain serializable object

```typescript
// ✅ Plain object — survives JSON.stringify/parse
interface GameState { ... }

// ❌ Class instance — breaks on deserialization
class GameState {
    copy(overrides) { ... } // Java-style — not needed in TS
}
```

**Why:** Persisting to localStorage, sending over WebSocket, and unit testing all require clean serialization. Class instances lose their methods after `JSON.parse`.

### Honor tile values live in GameState, not on tiles

See [section 3.1](#31-domain-model-coredomainmodel) for full explanation. Short version: one source of truth prevents sync bugs across deck/discard/hand copies of the same tile type.

### Tie = Loss

Standard Hi-Lo house rule. Documented assumption. Score floor is 0 — can never go negative.

### Engine functions return new state, never mutate

```typescript
// ✅ Returns new state
const newState = placeBet(state, bet);

// ❌ Would mutate
state.phase = GamePhase.REVEALING;
```

**Why:** Immutability makes state history trivial, enables undo/redo, and eliminates a whole class of bugs.

### reshuffle = discard pile + fresh deck

Per spec: when draw pile is empty, combine discard pile with a **brand new 136-tile deck** and shuffle. Not just reshuffle the discard pile alone.

### Tie is treated as Bet Lower

If current hand total = next hand total, it counts as the player losing (tie = loss, standard Hi-Lo house rule).

---

## 9. How to Add New Features

### New tile type

1. Add to `NumberTileGroup` or `NonNumberTileGroup` enum in `TileGroup.ts`
2. Add tile values to `NumberTileValues.ts` (if number tile)
3. Add base value to `Settings.NON_NUMBER_TILES_BASE_VALUES` (if honor tile)
4. `Deck.newDeck()` picks it up automatically
5. No other changes needed

### New game-over condition

1. Add reason to `GameOverReason` enum in `GameState.ts`
2. Add check in `GameOverChecker.isGameOver()`
3. Done — `BetsManager` and use cases pick it up automatically

### New scoring rule

1. Edit score calculation in `BetsManager.resolveBet()`
2. Or extract to `ScoreCalculator.ts` in `engine/` if it grows complex

### New bet type (e.g. "Exact Value")

1. Add to `BetDirection` enum in `Bet.ts`
2. Add case to `betOutcome()` in `BetsManager.ts`
3. Add button to `BettingControls.vue`

### New event

1. Add to `GameEventType` enum in `Event.ts`
2. Add context interface in `Event.ts`
3. Call `eventBus.publish()` in the relevant use case
4. Add handler wherever needed

### Switch to backend

1. Create `adapters/http/HttpGameRepo.ts` implementing `IGameRepo`
2. Create `adapters/ws/WsEventBus.ts` implementing `IGameEventBus`
3. Create `bootstrap/remote.ts` wiring the new adapters
4. Change one import in the Vue store

---

## 10. File Reference

```
src/
├── adapters/
│   ├── local/
│   │   ├── LocalEventBus.ts              # IGameEventBus — Set-based pub/sub
│   │   ├── LocalStorageGameRepo.ts       # IGameRepo — JSON in localStorage
│   │   ├── LocalStorageLeaderboardRepo.ts # ILeaderboardRepo — top-N sorted
│   │   └── LocalStorageSessionRepo.ts    # ISessionRepo — player name
│   └── http/                             # Future HTTP/WebSocket adapters
│
├── bootstrap/
│   └── local.ts                          # Wires adapters → use cases → services
│
└── core/
    ├── domain/
    │   ├── config/
    │   │   └── Settings.ts               # All magic numbers in one place
    │   ├── events/
    │   │   └── Event.ts                  # GameEvent<T>, GameEventType, contexts
    │   └── model/
    │       ├── Bet.ts                    # BetDirection, BetOutcome enums
    │       ├── Deck.ts                   # Deck type, newDeck(), draw()
    │       ├── GameHistoryRecord.ts      # One resolved round's snapshot
    │       ├── GameState.ts              # Master state + GamePhase + GameOverReason
    │       ├── Hand.ts                   # Hand interface + newHand() factory
    │       ├── Leaderboard.ts            # LeaderboardEntry interface
    │       ├── NumberTileValues.ts       # Possible values per number tile group
    │       ├── Tile.ts                   # Tile union, type guards, value resolver
    │       └── TileGroup.ts              # NumberTileGroup, NonNumberTileGroup enums
    │
    ├── engine/
    │   ├── BetsManager.ts                # placeBet(), resolveBet(), betOutcome()
    │   ├── GameEngine.ts                 # Facade — single import point for use cases
    │   ├── GameInitializer.ts            # initGame() → fresh GameState
    │   ├── GameOverChecker.ts            # isGameOver(), isReshuffleLimitReached()
    │   └── HonorValuesDynamicScaler.ts   # scaleHonorValues()
    │
    ├── ports/
    │   ├── in/
    │   │   ├── IGameService.ts           # IInitGameService + IPlaceBetService + IExitGameService
    │   │   └── ILeaderboardService.ts    # getTop(n)
    │   └── out/
    │       ├── IGameEventBus.ts          # publish, subscribe, unsubscribe
    │       ├── IGameRepo.ts              # save, load, clear
    │       ├── ILeaderboardRepo.ts       # save, getTop
    │       └── ISessionRepo.ts           # savePlayerName, getPlayerName, clear
    │
    ├── shared/
    │   └── helpers/
    │       └── ArrayHelper.ts            # shuffle()
    │
    └── usecases/
        ├── ExitGame.ts                   # save to leaderboard + clear game
        ├── GetLeaderboard.ts             # read top N entries
        ├── InitGame.ts                   # create + persist fresh game state
        └── PlaceBet.ts                   # full bet lifecycle + event publishing
```
