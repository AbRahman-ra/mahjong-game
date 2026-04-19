# Hand Betting Game — Architecture Reference

## Note: This document is fully generated with AI

# Hand Betting Game — Architecture Reference

> **Note: This document is fully generated with AI**
> A complete guide to the codebase structure, layer responsibilities, and dependency rules.
> Written to be re-read before onsite interviews or feature additions.

---

## Table of Contents

1. [Big Picture](#1-big-picture)
2. [The Golden Rule](#2-the-golden-rule)
3. [Project Structure](#3-project-structure)
4. [Layer-by-Layer Breakdown](#4-layer-by-layer-breakdown)
5. [Dependency Direction](#5-dependency-direction)
6. [Data Flow — A Full Round Trip](#6-data-flow--a-full-round-trip)
7. [Bet Lifecycle](#7-bet-lifecycle)
8. [Event Bus](#8-event-bus)
9. [Animation Architecture](#9-animation-architecture)
10. [Tile System](#10-tile-system)
11. [Key Design Decisions & Why](#11-key-design-decisions--why)
12. [How to Add New Features](#12-how-to-add-new-features)
13. [Documented Assumptions](#13-documented-assumptions)
14. [File Reference](#14-file-reference)

---

## 1. Big Picture

The project follows **Hexagonal Architecture** (Ports & Adapters), separating pure domain logic from UI concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    Vue UI (client/)                      │
│            views, components, composables                │
├─────────────────────────────────────────────────────────┤
│                  Pinia Stores                            │
│         gameStore, leaderboardStore, uiStore             │
├─────────────────────────────────────────────────────────┤
│                   Ports (in/out)                         │
│           IGameService, IGameRepo, ...                   │
├─────────────────────────────────────────────────────────┤
│                    Use Cases                             │
│         InitGame, PlaceBet, ExitGame, ...                │
├─────────────────────────────────────────────────────────┤
│                     Engine                               │
│      BetsManager, GameOverChecker, HonorScaler           │
├─────────────────────────────────────────────────────────┤
│                  Domain Model                            │
│      Tile, Hand, Deck, GameState, TileGroup              │
└─────────────────────────────────────────────────────────┘
         ↑ Dependencies only point INWARD ↑
```

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

| Import                                                      | Allowed?         |
| ----------------------------------------------------------- | ---------------- |
| `usecase/PlaceBet.ts` → `domain/model/GameState.ts`         | ✅ outer → inner |
| `engine/BetsManager.ts` → `domain/model/Tile.ts`            | ✅ outer → inner |
| `domain/model/Hand.ts` → `engine/BetsManager.ts`            | ❌ FORBIDDEN     |
| `domain/model/Tile.ts` → `store/gameStore.ts`               | ❌ FORBIDDEN     |
| `engine/GameEngine.ts` → `adapters/LocalStorageGameRepo.ts` | ❌ FORBIDDEN     |

---

## 3. Project Structure

```
src/
├── client/                          # Vue — everything framework-specific
│   ├── assets/css/                  # Global styles (split by concern)
│   │   ├── index.css                # Entry — imports all others
│   │   ├── variables.css            # CSS custom properties
│   │   ├── reset.css                # Box-sizing, margins, body
│   │   ├── typography.css           # .eyebrow and text utilities
│   │   ├── layout.css               # .app-shell, .ambient, .layout-shell
│   │   ├── panels.css               # .panel, .panel-accent
│   │   ├── buttons.css              # .button variants
│   │   ├── transitions.css          # .screen-fade-*
│   │   └── responsive.css           # Global @media queries
│   ├── components/                  # Dumb reusable components (props in, events out)
│   │   ├── BetControls.vue
│   │   ├── Leaderboard.vue
│   │   ├── ScoreDisplay.vue
│   │   ├── TileCard.vue
│   │   └── DropDownButton.vue
│   ├── composables/                 # Shared stateful logic
│   │   ├── useAnimatedNumber.ts     # Smooth number transitions
│   │   ├── useThrowAnimation.ts     # Hand → discard pile animation
│   │   └── useDrawPileAnimation.ts  # Draw pile → hand animation
│   ├── icons/                       # SVG icon components
│   ├── pages/                       # Page-level screens
│   │   ├── LandingView.vue
│   │   ├── EndView.vue
│   │   └── game/
│   │       ├── GameView.vue         # Orchestrator — composes all game partials
│   │       └── partials/            # Game-specific smart components
│   │           ├── Topbar.vue
│   │           ├── GameTable.vue
│   │           ├── DrawPile.vue
│   │           ├── DiscardPile.vue
│   │           ├── CurrentHand.vue
│   │           ├── HandHistory.vue
│   │           ├── ResolutionBanner.vue
│   │           ├── ExitConfirmDialog.vue
│   │           ├── ScoreDisplay.vue
│   │           ├── PileCounters.vue
│   │           └── ExitButton.vue
│   ├── store/
│   │   ├── gameStore.ts
│   │   ├── leaderboardStore.ts
│   │   └── uiStore.ts
│   ├── router/index.ts
│   ├── App.vue
│   └── main.ts
│
└── server/                          # Framework-agnostic TypeScript core
    ├── adapters/
    │   ├── local/                   # localStorage implementations
    │   │   ├── LocalEventBus.ts
    │   │   ├── LocalStorageGameRepo.ts
    │   │   ├── LocalStorageLeaderboardRepo.ts
    │   │   └── LocalStorageSessionRepo.ts
    │   └── http/                    # Future HTTP/WebSocket implementations
    ├── bootstrap/
    │   └── local.ts                 # Composition root — wires everything
    └── core/
        ├── domain/
        │   ├── config/Settings.ts   # All constants + TileGroup definitions
        │   ├── events/Event.ts      # GameEvent<T>, GameEventType, contexts
        │   └── model/
        │       ├── Bet.ts
        │       ├── Deck.ts
        │       ├── GameHistoryRecord.ts
        │       ├── GameState.ts
        │       ├── Hand.ts
        │       ├── Leaderboard.ts
        │       ├── TileGroup.ts
        │       ├── TileLabel.ts
        │       ├── TileValue.ts
        │       └── Tile.ts
        ├── engine/
        │   ├── BetsManager.ts
        │   ├── GameEngine.ts        # Facade
        │   ├── GameInitializer.ts
        │   ├── GameOverChecker.ts
        │   └── HonorValuesDynamicScaler.ts
        ├── ports/
        │   ├── in/IGameService.ts
        │   ├── in/ILeaderboardService.ts
        │   ├── out/IGameEventBus.ts
        │   ├── out/IGameRepo.ts
        │   ├── out/ILeaderboardRepo.ts
        │   └── out/ISessionRepo.ts
        ├── shared/helpers/ArrayHelper.ts
        └── usecases/
            ├── ExitGame.ts
            ├── GetLeaderboard.ts
            ├── InitGame.ts
            └── PlaceBet.ts          # drawNextHand() + resolveBet()
```

---

## 4. Layer-by-Layer Breakdown

### 4.1 Domain Model

**What it is:** Pure data. No logic beyond simple transformations.
**Depends on:** Nothing.

#### Tile System

```typescript
type Tile = NumberTile | NonNumberTile;

interface NumberTile {
    readonly id: string; // crypto.randomUUID() at deck creation
    readonly type: NumberTileGroup;
    readonly value: TileValue; // { value: number, label: TileLabel }
}

interface NonNumberTile {
    readonly id: string;
    readonly type: NonNumberTileGroup;
    readonly label: TileLabel; // { format: CHARACTER | IMAGE_URL, value: string }
}
```

**Why `id`?** Unique identity per physical tile for `v-for` keys and animation tracking.

**Why `TileValue` instead of just `number`?** Separates game value (numeric, for scoring) from display label (string, for rendering). A `9 Dots` tile could show a dots image while still being worth 9 points.

**Why honor tiles have no value field?** Their numeric value lives in `GameState.honorValues` — one source of truth for all 4 copies of the same tile type.

#### TileGroup — The Extension Point

```typescript
interface TileGroup {
    type:            NumberTileGroup | NonNumberTileGroup;
    copies:          number;
    accent:          string;          // hex color
    label:           TileLabel;       // group symbol e.g. '萬', '中', '風'
    dynamicScaler?:  Record<BetOutcome, number>; // omitted = no scaling
    possibleValues?: TileValue[];     // number tiles only
    baseValue?:      number;          // honor tiles only
}

// Settings.TILE_GROUPS — TypeScript enforces completeness
const TILE_GROUPS: Record<NumberTileGroup | NonNumberTileGroup, TileGroup> = { ... }
```

Adding a new tile type = one new entry. TypeScript errors if you forget.

#### GameState

```typescript
interface GameState {
    phase: GamePhase; // BETTING | REVEALING | GAME_OVER
    score: number;
    reshuffleCount: number;
    drawPile: Deck;
    discardPile: Tile[];
    currentHand: Hand;
    nextHand?: Hand; // set during REVEALING phase
    history: GameHistoryRecord[];
    honorValues: Record<NonNumberTileGroup, number>;
    gameOverReason?: GameOverReason;
    currentBet?: BetDirection;
}
```

Plain serializable object — survives `JSON.stringify/parse` for localStorage and WebSocket transport.

---

### 4.2 Engine

**What it is:** Pure functions. `GameState → GameState`. No side effects, no async.

Accessed via a single facade (`GameEngine.ts`) — use cases never import individual engine files directly.

#### Bet Flow

```
placeBet(state, bet):
    ├── Draw pile empty + reshuffle limit? → GAME_OVER
    ├── Draw pile empty? → reshuffle (shuffle discardPile, new ids)
    ├── Draw next hand → state.nextHand
    └── phase = REVEALING (or GAME_OVER if limit just reached)

resolveBet(state):
    ├── Compare currentHand.total vs nextHand.total
    ├── Determine WIN / LOSE (tie = LOSE)
    ├── Update score (floor: MIN_POSSIBLE_SCORE)
    ├── Scale honor tile values
    ├── Check game over (honor value bounds)
    ├── Build GameHistoryRecord
    └── phase = BETTING (or GAME_OVER)
```

#### Why tiles get new ids on reshuffle

```typescript
drawPile = shuffle([...discardPile]).map((t) => ({
    ...t,
    id: crypto.randomUUID(),
}));
```

Prevents duplicate Vue `v-for` key warnings when a tile reappears after reshuffle.

---

### 4.3 Ports

```
ports/in/   — driving ports (Vue calls core)
ports/out/  — driven ports (core calls infrastructure)
```

`IPlaceBetService` exposes two methods — intentionally split for animation control:

```typescript
interface IPlaceBetService {
    drawNextHand(bet: BetDirection): Promise<GameState>; // draws nextHand → REVEALING
    resolveBet(): Promise<GameState>; // resolves outcome → BETTING
}
```

---

### 4.4 Use Cases

`PlaceBet` contains both methods — split enables the UI to play animations between calls:

```typescript
class PlaceBet implements IPlaceBetService {
    async drawNextHand(bet): Promise<GameState> {
        /* ENGINE.placeBet → save → events */
    }
    async resolveBet(): Promise<GameState> {
        /* ENGINE.resolveBet → save → events */
    }
}
```

---

### 4.5 Adapters

Concrete implementations of `ports/out/`. Never imported by core — only by bootstrap.

`LocalEventBus` uses a `Set` of handlers — deduplicates, no double-firing.

All localStorage methods return `Promise<>` — swapping to HTTP requires zero interface changes.

---

### 4.6 Bootstrap

The only place that knows about concrete implementations. Wires everything once.

```typescript
// bootstrap/local.ts
export const gameService: IGameService = {
    initGame: initGame.initGame.bind(initGame),
    drawNextHand: placeBet.drawNextHand.bind(placeBet),
    resolveBet: placeBet.resolveBet.bind(placeBet),
    exitGame: exitGame.exitGame.bind(exitGame),
};
```

Switching to backend = create `bootstrap/remote.ts`, change one import.

---

### 4.7 Vue Stores

| Store              | Responsibility                                 |
| ------------------ | ---------------------------------------------- |
| `gameStore`        | Mirrors `GameState`, calls `gameService`       |
| `leaderboardStore` | Fetches and holds leaderboard entries          |
| `uiStore`          | Transient UI state (notifications, bet result) |

Stores subscribe to the event bus once at creation — no mount/unmount needed.

---

### 4.8 Vue UI

#### Component Classification

| Type            | Location                      | Rule                                                |
| --------------- | ----------------------------- | --------------------------------------------------- |
| Dumb components | `client/components/`          | Props in, events out, may read `Settings`           |
| Smart partials  | `client/pages/game/partials/` | May read stores, specific to one view               |
| Views           | `client/pages/`               | Orchestrate partials, own routing + animation logic |

#### `CurrentHand.vue` — `showNextHand` prop

When `showNextHand = true`, renders `nextHand.tiles` instead of `currentHand.tiles`. Enables animation to clone correct tile values before `resolveBet()` makes them official.

#### `DiscardPile.vue` — Split DOM ownership

```vue
<div class="discard-pile__area" ref="discardedPilesRect">  <!-- Vue manages -->
    <div v-if="!discardPile.length" class="discard-pile__empty" />
    <div class="discard-pile__clones" ref="discardedPilesArea" />  <!-- animation manages -->
</div>
```

Vue never renders children into `.discard-pile__clones` — prevents virtual DOM reconciliation crashes when animation appends clones.

---

### 4.9 Composables

#### `useThrowAnimation(pileAreaRef, pileRectRef, selector)`

Animates tiles from `CurrentHand` to discard pile via DOM cloning. Uses two refs:

- `pileAreaRef` → `.discard-pile__clones` (append target, Vue-free)
- `pileRectRef` → `.discard-pile__area` (coordinate source)

#### `useDrawPileAnimation(drawPileRef)`

Animates tiles from draw pile to current hand with two-stage card flip:

1. Fly to target + `rotateY(90deg)` (card edge-on)
2. Swap to face-up background + `rotateY(0deg)` (reveals face)

#### `useAnimatedNumber(source, duration)`

Smoothly transitions number displays using `requestAnimationFrame` + ease-out cubic.

---

## 5. Dependency Direction

```
                    ┌──────────────────────────────────┐
                    │         Vue UI (client/)          │
                    └──────────────┬───────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────────┐
                    │         Pinia Stores              │
                    └──────────────┬───────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────────┐
                    │          ports/in/               │
                    └──────────────┬───────────────────┘
                                   │ implemented by
                                   ▼
                    ┌──────────────────────────────────┐
                    │          usecases/               │──────► ports/out/
                    └──────────────┬───────────────────┘            │
                                   │                                │ implemented by
                                   ▼                                ▼
                    ┌──────────────────────────────────┐      ┌─────────────────┐
                    │           engine/                │      │   adapters/     │
                    └──────────────┬───────────────────┘      └────────┬────────┘
                                   │                                   │
                                   ▼                                   │
                    ┌──────────────────────────────────┐               │
                    │       domain/model/              │◄──────────────┘
                    └──────────────────────────────────┘

                    bootstrap/local.ts — knows all layers, wires everything
```

---

## 6. Data Flow — A Full Round Trip

### Player clicks "Bet Higher"

```
1. BetControls.vue emits 'bet'

2. GameView.onBet(HIGHER):
   ├── throwTiles()              ← animate cards flying to discard
   ├── gameStore.drawNextHand()  ← nextHand set in state
   ├── showNextHand = true       ← CurrentHand renders nextHand tiles
   ├── dealTiles()               ← animate cards from draw pile (correct values)
   ├── showNextHand = false
   └── gameStore.resolveBet()   ← score updated, currentHand = nextHand

3. Vue reactivity updates all components
4. App.vue watcher: if GAME_OVER → nextTick() → router.push('end')
```

---

## 7. Bet Lifecycle

```
Phase: BETTING
    │
    │ player bets
    ▼
PlaceBet.drawNextHand()
    │
    ├── draw pile empty + limit → GAME_OVER ──────────────────► EndView
    ├── draw pile empty → reshuffle (new ids)
    └── draw tiles → state.nextHand
    │
Phase: REVEALING
    │
    │ [animation: tiles fly from draw pile, flip to reveal]
    │
PlaceBet.resolveBet()
    │
    ├── compare totals → WIN / LOSE
    ├── update score
    ├── scale honor values
    ├── check game over → GAME_OVER ──────────────────────────► EndView
    └── currentHand = nextHand
    │
Phase: BETTING ◄──────────────────────────────────────────────
```

---

## 8. Event Bus

| Event              | Published by | Subscribed by            |
| ------------------ | ------------ | ------------------------ |
| `GAME_OVER`        | PlaceBet     | gameStore, uiStore       |
| `PILE_OUTAGE`      | PlaceBet     | uiStore (notification)   |
| `SUCCESSFUL_BET`   | PlaceBet     | uiStore (win animation)  |
| `UNSUCCESSFUL_BET` | PlaceBet     | uiStore (lose animation) |

Adding a new reaction = new `subscribe()` call. Zero changes to publishers.

---

## 9. Animation Architecture

### Throw Animation (hand → discard)

```
1. Clone each tile's <article> element
2. Position clone fixed over original (getBoundingClientRect)
3. Animate clone to random position within discardedPilesRect area
4. After 800ms: switch clone to position:absolute inside discardedPilesArea
5. Remove oldest clones if over MAX_VISIBLE_DISCARD_PILES
```

### Deal Animation (draw pile → hand)

```
1. Hide real tiles (opacity: 0)
2. Create face-down clones at draw pile position (stackRef)
3. Stage 1: fly to hand slot + rotateY(90deg)  ← card edge-on
4. Stage 2: face-up background + rotateY(0deg) ← reveals face
5. Fade real tiles in (opacity transition)
```

### Critical: Split DOM ownership in DiscardPile

```
.discard-pile__area     ← Vue manages (empty state v-if)
.discard-pile__clones   ← Animation manages (Vue never touches children)
```

Without this split, Vue's reconciliation crashes when it finds unexpected DOM nodes during `gameState` updates.

### Number Animations

`useAnimatedNumber` — `requestAnimationFrame` loop with ease-out cubic easing. Applied to score, hand total, pile counters, resolution banner.

---

## 10. Tile System

### Honor tile values

Stored in `GameState.honorValues`, not on tile instances:

```
// ❌ Sync problem with 4 physical copies
{ type: WIND, value: 7 }  ← in hand (just won)
{ type: WIND, value: 6 }  ← in draw pile (stale)

// ✅ One source of truth
GameState.honorValues = { WIND: 7, DRAGON: 5 }
value(tile, honorValues) → always consistent
```

### Dynamic scaling

```typescript
const delta = Settings.TILE_GROUPS[tile.type].dynamicScaler?.[outcome] ?? 0;
updated[tile.type] = honorValues[tile.type] + delta;
```

Per-group, configurable in `Settings.TILE_GROUPS`. Number tiles omit `dynamicScaler` = no scaling.

---

## 11. Key Design Decisions & Why

**GameState is a plain object** — survives `JSON.parse`, works with localStorage and WebSocket.

**Bet split into `drawNextHand` + `resolveBet`** — enables animation between calls. `showNextHand` prop makes `CurrentHand` render correct values during animation.

**Tie = Loss** — standard Hi-Lo house rule. Score floor: 0.

**Reshuffle = shuffle discard pile only** — spec says "add fresh deck" but creates ever-growing pile. Documented deviation.

**`DISCARD_LAST_BEFORE_RESHUFFLE` setting** — optional inclusion of current hand tiles in reshuffle pool. Configurable without touching engine logic.

**New tile ids on reshuffle** — prevents duplicate Vue `v-for` key warnings.

**`TileGroup` as config object** — all tile-type-specific config in one place. TypeScript enforces completeness.

---

## 12. How to Add New Features

### New tile type

1. Add to `NumberTileGroup` or `NonNumberTileGroup` in `TileGroup.ts`
2. Add entry to `Settings.TILE_GROUPS`
3. TypeScript errors guide remaining changes

### New game-over condition

1. Add to `GameOverReason` enum
2. Add check in `GameOverChecker.isGameOver()`
3. Add message to `EndView.REASON_MESSAGES`

### New bet type

1. Add to `BetDirection` enum
2. Add case to `betOutcome()` in `BetsManager`
3. Add button to `BetControls.vue`

### New event

1. Add to `GameEventType` + context to `Event.ts`
2. Publish in relevant use case
3. Subscribe in store or component

### Switch to backend

1. Create `adapters/http/` implementations
2. Create `server/bootstrap/remote.ts`
3. Change one import in `client/main.ts`

---

## 13. Documented Assumptions

| Topic               | Assumption                                                     |
| ------------------- | -------------------------------------------------------------- |
| Hand size           | 4 tiles                                                        |
| Tile distribution   | NUMBER (9×4=36), WIND (4), DRAGON (4) = 44 tiles total         |
| Tie outcome         | Loss (standard Hi-Lo house rule)                               |
| Score floor         | 0                                                              |
| Honor value cap     | Game ends when scaling reaches 0 or 10                         |
| Scaling granularity | Per group (all WINDs share one value)                          |
| Reshuffle           | Shuffle discard pile only — no fresh deck (deviates from spec) |
| Leaderboard         | localStorage, top 5                                            |

---

## 14. File Reference

```
server/core/
├── domain/config/Settings.ts        # TILE_GROUPS, HAND_SIZE, DECK_SIZE, conditions
├── domain/events/Event.ts           # GameEvent<T>, GameEventType, contexts
├── domain/model/Tile.ts             # Tile union, type guards, value()
├── domain/model/TileGroup.ts        # Enums + TileGroup interface
├── domain/model/TileLabel.ts        # TileLabel, TileLabelFormat
├── domain/model/TileValue.ts        # { value: number, label: TileLabel }
├── domain/model/GameState.ts        # Master state + enums
├── domain/model/Hand.ts             # Hand + newHand()
├── domain/model/Deck.ts             # newDeck() + draw()
├── domain/model/Bet.ts              # BetDirection, BetOutcome
├── domain/model/Leaderboard.ts      # LeaderboardEntry
├── engine/BetsManager.ts            # placeBet() + resolveBet()
├── engine/GameEngine.ts             # Facade
├── engine/GameInitializer.ts        # initGame()
├── engine/GameOverChecker.ts        # isGameOver() + isReshuffleLimitReached()
├── engine/HonorValuesDynamicScaler.ts
├── ports/in/IGameService.ts         # Split: drawNextHand + resolveBet
├── ports/out/IGameRepo.ts           # save, load, clear
├── ports/out/IGameEventBus.ts       # publish, subscribe, unsubscribe
├── usecases/PlaceBet.ts             # drawNextHand() + resolveBet()
├── usecases/InitGame.ts
├── usecases/ExitGame.ts
└── usecases/GetLeaderboard.ts

client/
├── composables/useThrowAnimation.ts    # Hand → discard DOM clone animation
├── composables/useDrawPileAnimation.ts # Draw pile → hand flip animation
├── composables/useAnimatedNumber.ts    # Smooth number counter transitions
├── store/gameStore.ts                  # GameState mirror + drawNextHand/resolveBet
├── store/leaderboardStore.ts
├── store/uiStore.ts
├── pages/game/GameView.vue             # Orchestrator + animation controller
├── pages/game/partials/Topbar.vue      # Score + Resolution + Counters + Exit
├── pages/game/partials/DiscardPile.vue # Split DOM: Vue area + animation clones area
├── pages/game/partials/DrawPile.vue    # Exposes stackRef for animation source
├── pages/game/partials/CurrentHand.vue # showNextHand prop for animation
└── pages/game/partials/HandHistory.vue # Scrollable list + mobile dropdown
```

---

_Last updated after full implementation including animation architecture, tile system, and bet lifecycle split._
