# Animal Shogi Project Instructions

This project implements a web-based version of Animal Shogi (動物将棋), a Japanese board game using Vite, vanilla JavaScript, and CSS.

## Project Overview

- **Type**: Vite-based web application
- **Language**: JavaScript (Vanilla)
- **Purpose**: Interactive Animal Shogi game board with turn-based gameplay

## Key Components

1. **main.js**: Contains all game logic
   - Board initialization and piece placement
   - Move validation based on piece types
   - Turn management and piece promotion
   - Win condition checking

2. **style.css**: Styling for the game
   - 9x9 board grid layout
   - Piece styling with Japanese characters
   - Board colors and hover effects

3. **index.html**: Page structure and entry point

## Development Guidelines

- Use Vite's HMR (Hot Module Replacement) for development
- Keep game logic in main.js organized by function
- Pieces are represented as objects: `{ type, player }`
- Board is a 2D array: `board[row][col]`

## Build and Run

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Game Architecture

- **Board Size**: 9x9 grid
- **Piece Types**: LION, ELEPHANT, GIRAFFE, CHICK, HEN
- **Players**: BLACK (top), WHITE (bottom)
- **Move Validation**: Implemented per piece type in `isValidMove()`

## Future Enhancement Ideas

- Game state persistence
- Move history
- AI opponent
- Piece animations
- Mobile optimization
