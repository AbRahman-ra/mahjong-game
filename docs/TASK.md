# Technical Assessment: Hand Betting Game

## Overview

Your task is to build a web-based "Hand Betting Game" using Mahjong tiles. This project evaluates your ability to handle complex state management, UI polish, and code scalability.

Note: This project should be built with the future in mind. During the onsite interview, you will be asked to add new features or extend the existing logic of this codebase. Code readiness for extension is a primary evaluation factor.

---

## Core Requirements & Acceptance Criteria (AC)

### 1. Landing Page

- New Game: A clear entry point to start a session.
- Leaderboard: Display a list of the top 5 high scores.

### 2. Game Mechanics & Logic

- Tile Set: Use Mahjong tiles (Dragons, Winds, and Number tiles).
- Tile Values:
    - Number Tiles: Value equals the face value of the tile.
    - Non-Number Tiles (Dragons/Winds): Start at a base value of 5.
- Dynamic Scaling: Every time a non-number tile is part of a winning hand, its value increases by 1. If it is part of a losing hand, it decreases by 1 (specific to that tile).
- Deck Management:
    - Display the count of tiles remaining in the Draw Pile and the Discard Pile.
    - Reshuffling: When the Draw Pile is empty, add a fresh "deck" worth of tiles, combine them with the Discard Pile, and shuffle them into a new Draw Pile.  

### Game Over Conditions:

- Any single tile value reaches 0 or 10.
- The Draw Pile runs out of tiles for the 3rd time.

## 3. Gameplay Interface

- Navigation: A button to exit the game and return to the landing page.
- Betting: Two primary actions: "Bet Higher" or "Bet Lower" for the next hand.
- Visual State:
    - Display the current hand's total value and visual representations of the tiles.
    - Display a "History" view showing smaller versions of the previous hand's tiles and values.
- Score Summary: An end-of-game screen displaying the final score.

---

## Evaluation Criteria

- Polish: This is a major part of the evaluation. We are looking for high-quality CSS, smooth transitions, and an intuitive user experience.
- Scalability: The code must be "feature-ready." Your architecture should allow for easy additions (which will be tested onsite).  
- Code Quality: Clean, modular, and well-documented code.

---

## Submission Instructions

1. Repository: Provide a link to a public GitHub repository.
2. Documentation: Include a README.md with setup instructions and a brief note on what was handwritten vs. where AI was utilized.
3. Video Walkthrough: Record a short video demonstrating the gameplay and your technical approach.
4. Timeline: Please submit your work within 4 days.
