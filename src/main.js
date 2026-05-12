import './style.css'

// Animal Shogi game logic
const BOARD_ROWS = 4;
const BOARD_COLS = 3;
const board = Array(BOARD_ROWS).fill().map(() => Array(BOARD_COLS).fill(null));

// Piece types
const PIECES = {
  LION: 'lion',
  ELEPHANT: 'elephant',
  GIRAFFE: 'giraffe',
  CHICK: 'chick',
  HEN: 'hen'
};

// Players
const PLAYERS = {
  BLACK: 'black',
  WHITE: 'white'
};

// Captured pieces
let capturedPieces = {
  [PLAYERS.BLACK]: [],
  [PLAYERS.WHITE]: []
};

// Initialize board
function initBoard() {
  // Black pieces (top - opponent's side)
  board[0][0] = { type: PIECES.ELEPHANT, player: PLAYERS.BLACK };
  board[0][1] = { type: PIECES.LION, player: PLAYERS.BLACK };
  board[0][2] = { type: PIECES.GIRAFFE, player: PLAYERS.BLACK };
  board[1][1] = { type: PIECES.CHICK, player: PLAYERS.BLACK };

  // White pieces (bottom - player's side)
  board[3][0] = { type: PIECES.ELEPHANT, player: PLAYERS.WHITE };
  board[3][1] = { type: PIECES.LION, player: PLAYERS.WHITE };
  board[3][2] = { type: PIECES.GIRAFFE, player: PLAYERS.WHITE };
  board[2][1] = { type: PIECES.CHICK, player: PLAYERS.WHITE };
}

let currentPlayer = PLAYERS.WHITE; // White starts (bottom player)
let selectedSquare = null;
let selectedCapturedPiece = null;

// Render board
function renderBoard() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <h1>Animal Shogi</h1>
    <div id="game-container">
      <div id="board"></div>
      <div id="captured-pieces">
        <div id="black-captured">
          <h3>Black Captured</h3>
          <div id="black-captured-list"></div>
        </div>
        <div id="white-captured">
          <h3>White Captured</h3>
          <div id="white-captured-list"></div>
        </div>
      </div>
    </div>
    <div id="status">Current player: ${currentPlayer}</div>
  `;

  const boardElement = document.getElementById('board');

  // Get valid moves for selected piece or valid drops for selected captured piece
  let validMoves = [];
  let validDrops = [];
  if (selectedSquare) {
    const [selectedRow, selectedCol] = selectedSquare;
    validMoves = getValidMoves(selectedRow, selectedCol);
  } else if (selectedCapturedPiece !== null) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        if (isValidDrop(currentPlayer, selectedCapturedPiece, row, col)) {
          validDrops.push([row, col]);
        }
      }
    }
  }

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const square = document.createElement('div');
      square.className = 'square';
      square.dataset.row = row;
      square.dataset.col = col;
      square.addEventListener('click', () => handleSquareClick(row, col));

      // Highlight selected square and add valid move/drop indicators
      if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
        square.classList.add('selected');
      }

      const isValidMoveSquare = validMoves.some(([moveRow, moveCol]) => moveRow === row && moveCol === col);
      const isValidDropSquare = validDrops.some(([dropRow, dropCol]) => dropRow === row && dropCol === col);
      if (isValidMoveSquare || isValidDropSquare) {
        square.classList.add('valid-move');
      }

      const piece = board[row][col];
      if (piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = `piece ${piece.type} ${piece.player}`;
        pieceElement.textContent = getPieceSymbol(piece);
        square.appendChild(pieceElement);
      }

      boardElement.appendChild(square);
    }
  }

  // Render captured pieces
  renderCapturedPieces();
}

// Render captured pieces
function renderCapturedPieces() {
  const blackList = document.getElementById('black-captured-list');
  const whiteList = document.getElementById('white-captured-list');

  blackList.innerHTML = '';
  whiteList.innerHTML = '';

  capturedPieces[PLAYERS.BLACK].forEach((pieceType, index) => {
    const pieceElement = document.createElement('div');
    pieceElement.className = `captured-piece ${pieceType} ${PLAYERS.BLACK}`;
    pieceElement.textContent = getPieceSymbol({ type: pieceType });
    pieceElement.dataset.index = index;
    pieceElement.addEventListener('click', () => handleCapturedPieceClick(PLAYERS.BLACK, index));
    blackList.appendChild(pieceElement);
  });

  capturedPieces[PLAYERS.WHITE].forEach((pieceType, index) => {
    const pieceElement = document.createElement('div');
    pieceElement.className = `captured-piece ${pieceType} ${PLAYERS.WHITE}`;
    pieceElement.textContent = getPieceSymbol({ type: pieceType });
    pieceElement.dataset.index = index;
    pieceElement.addEventListener('click', () => handleCapturedPieceClick(PLAYERS.WHITE, index));
    whiteList.appendChild(pieceElement);
  });
}

// Get piece symbol
function getPieceSymbol(piece) {
  const symbols = {
    [PIECES.LION]: '🦁',
    [PIECES.ELEPHANT]: '🐘',
    [PIECES.GIRAFFE]: '🦒',
    [PIECES.CHICK]: '🐥',
    [PIECES.HEN]: '🐔'
  };
  return symbols[piece.type];
}

// Handle square click
function handleSquareClick(row, col) {
  const piece = board[row][col];

  if (selectedCapturedPiece !== null) {
    // Placing a captured piece
    if (!piece && isValidDrop(currentPlayer, selectedCapturedPiece, row, col)) {
      const pieceType = capturedPieces[currentPlayer][selectedCapturedPiece];
      board[row][col] = { type: pieceType, player: currentPlayer };
      capturedPieces[currentPlayer].splice(selectedCapturedPiece, 1);
      selectedCapturedPiece = null;

      // Check for win by try (lion reaching opponent's back row)
      if (pieceType === PIECES.LION) {
        if ((currentPlayer === PLAYERS.WHITE && row === 0) ||
            (currentPlayer === PLAYERS.BLACK && row === 3)) {
          alert(`${currentPlayer} wins by try!`);
          initBoard();
          capturedPieces = { [PLAYERS.BLACK]: [], [PLAYERS.WHITE]: [] };
          return;
        }
      }

      currentPlayer = currentPlayer === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;
    } else {
      selectedCapturedPiece = null;
    }
  } else if (selectedSquare) {
    const [selectedRow, selectedCol] = selectedSquare;
    const selectedPiece = board[selectedRow][selectedCol];

    if (selectedRow === row && selectedCol === col) {
      // Deselect
      selectedSquare = null;
    } else if (selectedPiece && selectedPiece.player === currentPlayer && isValidMove(selectedRow, selectedCol, row, col)) {
      // Move piece
      const capturedPiece = board[row][col];
      if (capturedPiece) {
        // Add to captured pieces (hen becomes chick)
        const capturedType = capturedPiece.type === PIECES.HEN ? PIECES.CHICK : capturedPiece.type;
        capturedPieces[currentPlayer].push(capturedType);

        // Check for win by catch (lion capture)
        if (capturedPiece.type === PIECES.LION) {
          alert(`${currentPlayer} wins by catch!`);
          initBoard();
          capturedPieces = { [PLAYERS.BLACK]: [], [PLAYERS.WHITE]: [] };
          return;
        }
      }

      board[row][col] = selectedPiece;
      board[selectedRow][selectedCol] = null;

      // Promote chick to hen if reaching opponent's side
      if (selectedPiece.type === PIECES.CHICK) {
        if ((selectedPiece.player === PLAYERS.WHITE && row === 0) ||
            (selectedPiece.player === PLAYERS.BLACK && row === 3)) {
          selectedPiece.type = PIECES.HEN;
        }
      }

      // Check for win by try (lion reaching opponent's back row)
      if (selectedPiece.type === PIECES.LION) {
        if ((selectedPiece.player === PLAYERS.WHITE && row === 0) ||
            (selectedPiece.player === PLAYERS.BLACK && row === 3)) {
          alert(`${currentPlayer} wins by try!`);
          initBoard();
          capturedPieces = { [PLAYERS.BLACK]: [], [PLAYERS.WHITE]: [] };
          return;
        }
      }

      currentPlayer = currentPlayer === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;
      selectedSquare = null;
    } else {
      selectedSquare = null;
    }
  } else if (piece && piece.player === currentPlayer) {
    selectedSquare = [row, col];
  }

  renderBoard();
}

// Handle captured piece click
function handleCapturedPieceClick(player, index) {
  if (player === currentPlayer) {
    selectedCapturedPiece = index;
    selectedSquare = null;
    renderBoard();
  }
}

// Check if move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];

  // Can't move to square occupied by own piece
  if (targetPiece && targetPiece.player === piece.player) {
    return false;
  }

  // Can't move lion to a square where it would be captured immediately (suicide)
  if (piece.type === PIECES.LION) {
    if (wouldBeCaptured(toRow, toCol, piece.player)) {
      return false;
    }
  }

  const dRow = toRow - fromRow;
  const dCol = toCol - fromCol;

  switch (piece.type) {
    case PIECES.LION:
      return Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1 && !(dRow === 0 && dCol === 0);
    case PIECES.ELEPHANT:
      return Math.abs(dRow) === 1 && Math.abs(dCol) === 1;
    case PIECES.GIRAFFE:
      return (Math.abs(dRow) === 1 && dCol === 0) || (dRow === 0 && Math.abs(dCol) === 1);
    case PIECES.CHICK:
      return (piece.player === PLAYERS.WHITE && dRow === -1 && dCol === 0) ||
             (piece.player === PLAYERS.BLACK && dRow === 1 && dCol === 0);
    case PIECES.HEN:
      // Hen can move to 6 directions: forward, backward, left, right, and two forward diagonals
      if (piece.player === PLAYERS.WHITE) {
        return (dRow === -1 && dCol === 0) || // forward
               (dRow === 1 && dCol === 0) || // backward
               (dRow === 0 && Math.abs(dCol) === 1) || // left/right
               (dRow === -1 && Math.abs(dCol) === 1); // forward diagonals
      } else {
        return (dRow === 1 && dCol === 0) || // forward
               (dRow === -1 && dCol === 0) || // backward
               (dRow === 0 && Math.abs(dCol) === 1) || // left/right
               (dRow === 1 && Math.abs(dCol) === 1); // forward diagonals
      }
    default:
      return false;
  }
}

// Check if dropping a piece is valid
function isValidDrop(player, capturedIndex, row, col) {
  const pieceType = capturedPieces[player][capturedIndex];

  // Can't drop on occupied square
  if (board[row][col]) {
    return false;
  }

  // Can't drop lion on opponent's back row immediately (would win by try)
  if (pieceType === PIECES.LION) {
    if ((player === PLAYERS.WHITE && row === 0) ||
        (player === PLAYERS.BLACK && row === 3)) {
      return false;
    }
  }

  // Can't drop piece where it would be captured immediately (for lion)
  if (pieceType === PIECES.LION && wouldBeCaptured(row, col, player)) {
    return false;
  }

  return true;
}

// Check if a piece would be captured immediately at the given position
function wouldBeCaptured(row, col, player) {
  const opponent = player === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;

  // Check all possible moves from opponent pieces (without calling isValidMove to avoid recursion)
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.player === opponent) {
        const dRow = row - r;
        const dCol = col - c;

        // Check if the piece can move to the target position
        let canMove = false;
        switch (piece.type) {
          case PIECES.LION:
            canMove = Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1 && !(dRow === 0 && dCol === 0);
            break;
          case PIECES.ELEPHANT:
            canMove = Math.abs(dRow) === 1 && Math.abs(dCol) === 1;
            break;
          case PIECES.GIRAFFE:
            canMove = (Math.abs(dRow) === 1 && dCol === 0) || (dRow === 0 && Math.abs(dCol) === 1);
            break;
          case PIECES.CHICK:
            canMove = (piece.player === PLAYERS.WHITE && dRow === -1 && dCol === 0) ||
                     (piece.player === PLAYERS.BLACK && dRow === 1 && dCol === 0);
            break;
          case PIECES.HEN:
            if (piece.player === PLAYERS.WHITE) {
              canMove = (dRow === -1 && dCol === 0) || // forward
                       (dRow === 1 && dCol === 0) || // backward
                       (dRow === 0 && Math.abs(dCol) === 1) || // left/right
                       (dRow === -1 && Math.abs(dCol) === 1); // forward diagonals
            } else {
              canMove = (dRow === 1 && dCol === 0) || // forward
                       (dRow === -1 && dCol === 0) || // backward
                       (dRow === 0 && Math.abs(dCol) === 1) || // left/right
                       (dRow === 1 && Math.abs(dCol) === 1); // forward diagonals
            }
            break;
        }

        if (canMove) {
          return true;
        }
      }
    }
  }

  return false;
}

// Get valid moves for a piece at given position
function getValidMoves(row, col) {
  const piece = board[row][col];
  if (!piece) return [];

  const validMoves = [];

  for (let toRow = 0; toRow < BOARD_ROWS; toRow++) {
    for (let toCol = 0; toCol < BOARD_COLS; toCol++) {
      if (isValidMove(row, col, toRow, toCol)) {
        validMoves.push([toRow, toCol]);
      }
    }
  }

  console.log(`Valid moves for piece at (${row}, ${col}):`, validMoves);
  return validMoves;
}

// Initialize and render
initBoard();
renderBoard();
