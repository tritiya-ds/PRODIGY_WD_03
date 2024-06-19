// player.js
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
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateMessage();
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

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    updateMessage();
});
