# Conversations with LLMs

## First Conversation: Assumptions and explaining the task

### Prompt

```
Explain this task to me in easy manner <TASK.md>
I thought it has a lot of uncertainty, so I asked them few questions:

I have few questions:
- What are the winning conditions?
- How much is the hand (i.e how many tiles drawn per turn)?
- What is the tile distribution? i.e How many copies of each tile?
- What happens if two hands have equal total value (tie)? Does the player lose immediately after a wrong bet? Or continues until the game over / win / lose conditions
Kindly let me know if there are specific answers for the game rule, or should I assume the answers

thy answered:
Feel free to assume the answers following the standard rules wherever possible.
```

### Response

```md
## Breaking It Down Simply

This is a **card game** (using Mahjong tiles instead of playing cards) where you **bet on whether the next hand will be higher or lower** than the current one — think of it like the classic "Hi-Lo" card game.

---

### The Core Loop (What Actually Happens Each Turn)

1. You're shown a hand of tiles with a **total value**
2. You bet: will the **next hand** be **higher or lower**?
3. Tiles are drawn, the new total is revealed
4. You were right → score goes up. Wrong → score goes down (or you lose)
5. Repeat until the game ends

---

### The Tiles

Think of them in two groups:

| Type         | Examples            | Value                                   |
| ------------ | ------------------- | --------------------------------------- |
| Number tiles | 1-man, 5-pin, 9-sou | Face value (1–9)                        |
| Honor tiles  | Dragons, Winds      | Start at 5, then **change dynamically** |

The **dynamic part** is the interesting twist — honor tiles remember their history. If the 3-Dragon keeps appearing in winning hands, its value climbs toward 10. If it keeps losing, it drops toward 0. This also acts as a **game-over trigger** (any tile hitting 0 or 10 ends the game).

---

### Game Over Happens When...

- Any tile's value hits **0 or 10**
- The draw pile runs out **3 times**

---

### What You're Actually Building

Three screens:

1. **Landing page** — Start game + Leaderboard (top 5 scores)
2. **Game screen** — Current hand display, Bet Higher / Bet Lower buttons, history of previous hands, pile counters
3. **End screen** — Final score summary

---

### The Assumptions You'll Need to Make

Since they said "follow standard rules where possible," reasonable defaults are:

- **Hand size:** 4 tiles (standard Mahjong draw concept, or you could do 1 like Hi-Lo — **1 tile per hand is simpler and more Hi-Lo faithful**)
- **Tile distribution:** Standard 136-tile Mahjong deck (4 copies of each tile)
- **Winning condition:** Simply — correct bet = win that round
- **Ties:** Treat as a push (no score change) or a loss — your call to document

---

### What They're Really Evaluating

The game rules are almost secondary. What they care about is:

- 🎨 **Polish** — Does it look and feel great? Smooth animations, nice UI
- 🏗️ **Extensibility** — Can they ask you to add a new tile type, a new bet type, or a new scoring rule _on the spot during the interview_ without your code falling apart?
- 🧹 **Code quality** — Is it modular, readable, easy to navigate?

The onsite will involve **live feature additions**, so architect it cleanly from day one — separate your game logic from your UI, and make the tile value system easy to plug new rules into.
```

### Prompt follow up

So you described the core loop as:

```
1. You're shown a hand of tiles with a total value
2. You bet: will the next hand be higher or lower?
3. Tiles are drawn, the new total is revealed
4. You were right → score goes up. Wrong → score goes down (or you lose)
5. Repeat until the game ends
```

What if the next hand = current hand?
Also, what do we do with the current hand? Do we append next hand to it or discard it and make currenthand = next hand?

### Response

```md
Great catch. This is genuinely ambiguous in the spec. Let me think through it carefully.

---

### What "specific to that tile" most likely means

They probably mean **per tile-type**, not per physical tile instance. So:

- All "Red Dragon" tiles share the same value
- If Red Dragon appears in a winning hand → **all** Red Dragons in the deck are now worth 6
- If it appears in a losing hand → all Red Dragons drop to 4

This makes the most gameplay sense because:

- It creates **meaningful meta-progression** within a session — you learn which honors are "hot" or "cold"
- It's trackable in a simple map: `{ "red-dragon": 7, "west-wind": 4, ... }`
- Discarded tiles are gone from play temporarily, but when reshuffled back in, they carry their updated value

---

### The alternative interpretation (per physical tile instance)

If it truly meant each physical copy of a tile has its own value independently, that would be:

- Nearly invisible to the player (you can't tell which _copy_ of Red Dragon you drew)
- Very complex to track for little gameplay benefit
- Confusing UX

This interpretation almost certainly isn't what they meant.

---

### My recommendation

Go with **per tile-type scaling**, document your assumption in the README, and structure your code so the scaling logic lives in one place — e.g. a `tileValues` map that gets updated after each hand resolves. This also makes it trivially easy to extend during the onsite (e.g. "what if number tiles also scale?" — one config change).
```

### Prompt 2nd follow up

and the dynamic scaling will happen to the tiles at the cuurent hand (B) right?

### Response

```md
**No — it should apply to Hand A (the resolved hand), not Hand B.**

Here's why:

Hand A is shown → you bet → Hand B is drawn
→ compare A vs B → resolve bet (win or lose)
→ scaling happens to Hand A's honor tiles
→ Hand A is discarded
→ Hand B becomes the new current hand

Hand A is the one that **participated in the resolved bet** — it was either part of a winning or losing outcome. So its honor tiles are what get scaled.

Hand B just became the current hand and hasn't been "played" yet — scaling it now would be premature, it hasn't resolved anything.

---

### A concrete example

- Hand A contains Red Dragon (value 5), total = 12
- You bet Higher
- Hand B drawn, total = 15 → you win
- Red Dragon (in Hand A) was part of a **winning** hand → Red Dragon type value increases to 6
- Hand A discarded, Hand B is now current
- Next time a Red Dragon appears anywhere, it's worth 6

This also means the scaling effect is **felt in future hands** after reshuffling, which creates a nice long-term strategic element rather than immediate same-turn impact.
```
