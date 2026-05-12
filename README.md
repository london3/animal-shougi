# Animal Shogi

A web-based implementation of Animal Shogi (動物将棋), a Japanese board game similar to traditional Shogi but with simplified rules and fewer pieces on a 3×4 board.

## Overview

Animal Shogi is a 3×4 turn-based strategy board game where two players (Black and White) control animal pieces. The goal is to capture your opponent's Lion or move your own Lion to the opponent's back row to win.

## Features

- 3×4 game board with traditional wooden appearance
- 4 different piece types with unique movement patterns
- Turn-based gameplay for 2 players
- Piece promotion system (Chicks promote to Hens)
- Captured piece system (can drop captured pieces back on board)
- Win conditions: Catch (capture opponent's Lion) or Try (move Lion to opponent's back row)
- Real-time board updates with hot module replacement (HMR)

## Piece Types and Movement

- **Lion (王)**: Can move one square in any direction (including diagonals) - like the King in chess
- **Elephant (象)**: Can move one square diagonally (× pattern)
- **Giraffe (麒)**: Can move one square horizontally or vertically (+ pattern)
- **Chick (雛)**: Can only move forward one square (promotes to Hen when reaching opponent's side)
- **Hen (鶏)**: Can move forward, backward, left, right, and diagonally forward (6 directions total)

## Initial Setup

The board starts with:
- **Black pieces** (top row): Elephant, Lion, Giraffe (left to right)
- **Black pieces** (2nd row): Chick in the center
- **White pieces** (3rd row): Chick in the center
- **White pieces** (bottom row): Elephant, Lion, Giraffe (left to right)

## How to Play

1. **Select a piece**: Click on one of your pieces to select it
2. **Move the piece**: Click on a valid target square to move your selected piece
3. **Capture pieces**: Move your pieces to capture opponent's pieces (same square)
4. **Drop captured pieces**: Click on a captured piece, then click on an empty square to place it
5. **Promote pieces**: Chicks automatically promote to Hens when reaching opponent's back row
6. **Win conditions**:
   - **Catch**: Capture your opponent's Lion
   - **Try**: Move your Lion to your opponent's back row (must be safe from immediate capture)

## Captured Pieces

- When you capture an opponent's piece, it becomes your captured piece
- Hens captured become Chicks again
- You can drop captured pieces on empty squares during your turn
- Cannot drop pieces on occupied squares
- Cannot drop Lion on opponent's back row immediately
- Cannot drop pieces where they would be captured immediately

## Game Rules

- White moves first
- Players alternate turns
- Each turn: move one piece OR drop one captured piece
- Cannot move Lion to a square where it would be captured immediately (suicide prevention)
- Game ends when a Lion is captured or reaches opponent's back row safely

## Technology Stack

- **Vite**: Fast frontend build tool and development server
- **Vanilla JavaScript**: Pure JavaScript implementation (no frameworks)
- **CSS3**: Modern styling with Flexbox and Grid layouts

## Project Structure

```
animal/
├── index.html          # HTML entry point
├── src/
│   ├── main.js         # Game logic and board rendering
│   ├── style.css       # Styling for the board and pieces
│   └── ...
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Build and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server runs at `http://localhost:5173/` by default.

## Future Enhancements

- Game state persistence
- Move history and game undo functionality
- AI opponent
- Mobile touch support optimization
- Sound effects and animations
- Draw detection (repetition)

## References

- Animal Shogi (動物将棋) is a traditional Japanese children's board game
- This implementation follows the standard international rules of Animal Shogi
