 // script.js
document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    let currentPlayer = 'X';
    let gameActive = true;
    const boardState = Array(9).fill(null);

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (boardState[index] || !gameActive) return;

        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        checkWinner();
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateMessage();
            if (currentPlayer === 'O') {
                aiMove();
            }
        }
    }

    function checkWinner() {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                gameActive = false;
                message.textContent = `Player ${boardState[a]} wins!`;
                return;
            }
        }

        if (!boardState.includes(null)) {
            gameActive = false;
            message.textContent = "It's a tie!";
        }
    }

    function updateMessage() {
        if (gameActive) {
            message.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function restartGame() {
        boardState.fill(null);
        cells.forEach(cell => (cell.textContent = ''));
        currentPlayer = 'X';
        gameActive = true;
        updateMessage();
    }

    function aiMove() {
        const bestMove = minimax(boardState, 'O').index;
        boardState[bestMove] = 'O';
        document.querySelector(`.cell[data-index='${bestMove}']`).textContent = 'O';
        checkWinner();
        if (gameActive) {
            currentPlayer = 'X';
            updateMessage();
        }
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

        if (checkWin(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWin(newBoard, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWin(board, player) {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === player);
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    updateMessage();
});
