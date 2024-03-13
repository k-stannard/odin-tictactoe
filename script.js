const gameBoard = (() => {
    const rows = 3
    const columns = 3
    let board = Array.from({ length: rows }, () =>
                new Array(columns).fill(0))

    const getBoard = () => board

    const addMarker = (marker, row, col) => {
        if(board[row][col] === 0) {
            board[row][col] = marker
        }
    }

    const cellAvailable = (row, col) => {
        return board[row][col] === 0 ? true : false
    }

    const clearBoard = () => {
        board.forEach(row => {
            row.fill(0)
        })
    }

    // const printBoard = () => console.log(board.map(row => row.join(' ')).join('\n'))

    return {
        getBoard,
        addMarker,
        cellAvailable,
        clearBoard
    }
})()

function transpose(matrix) {
    return Object.keys(matrix[0])
            .map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]))
}

function player(name, marker) {
    return { 
        name: name, 
        marker: marker 
    }
}

const game = (() => {
    const players = [
        player("Player One", 1),
        player("Player Two", 2)
    ]

    let playerTurn = players[0]

    const switchTurns = () => {
        playerTurn = playerTurn === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => playerTurn

    let hasWinner = false
    let gameOver = false
    const gameWon = () => hasWinner
    const isOver = () => gameOver

    const checkWinCondition = (board, marker) => {
        const matchingValue = (value) => value === marker

        for(let row of board) {
            if(row.every(matchingValue)) {
                hasWinner = true
            }
        }

        let transposedBoard = transpose(board)
        for(let row of transposedBoard) {
            if(row.every(matchingValue)) {
                hasWinner = true
            }
        }

        let mainDiagonal = Array.from(board, (row, index) => row[index])
        let antiDiagonal = Array.from(board, (row, index) => row[board.length - 1 - index])
        if(mainDiagonal.every(matchingValue) || antiDiagonal.every(matchingValue)) {
            hasWinner = true
        }
    }

    const activeBoard = (board) => {
        return board.flat().includes(0)
    }

    let winner;
    const getWinningPlayer = () => winner

    const playRound = (row, col) => {
        if(gameBoard.cellAvailable(row, col)) {
            gameBoard.addMarker(getActivePlayer().marker, row, col)
            checkWinCondition(gameBoard.getBoard(), getActivePlayer().marker)

            if(hasWinner) {
                gameOver = true
                winner = getActivePlayer().name
            } else if(!hasWinner && activeBoard(gameBoard.getBoard())) {
                switchTurns()
            } else {
                gameOver = true
            }
        }
    }

    const resetGame = () => {
        playerTurn = players[0]
        hasWinner = false
        gameOver = false
    }

    return {
        playRound,
        getActivePlayer,
        gameWon,
        isOver,
        getWinningPlayer,
        resetGame
    }
})()

const gameDisplay = (() => {
    const boardDiv = document.getElementById('board')
    const turnDiv = document.getElementById('turn')
    const resetButton = document.getElementById('reset')

    const updatePlayerTurn = () => {
        const activePlayer = game.getActivePlayer()
        turnDiv.textContent = `${activePlayer.name}'s Turn`

        if(game.isOver()) {
            if(!game.gameWon()) {
                turnDiv.textContent = "Game over - tie game!"
            } else {
                turnDiv.textContent = `Game over! ${game.getWinningPlayer()} wins!`
            }
        }
    }

    const render = () => {
        const board = gameBoard.getBoard()

        updatePlayerTurn()

        board.forEach(row => {
            const rowIndex = board.indexOf(row)
            row.forEach((_, index) => {
                const button = document.createElement('button')
                button.classList.add('cell')
                button.dataset.row = rowIndex
                button.dataset.column = index
                button.dataset.marker = 0
                boardDiv.appendChild(button)
            })
        })
    }

    const placeMarker = (event) => {
        let selectedRow = event.target.dataset.row
        let selectedCol = event.target.dataset.column
        let target = event.target

        if(!selectedCol || !selectedRow) { return }
        if(target.dataset.marker === '0' && !game.isOver()) {
            let btn = document.querySelector(`[data-row="${selectedRow}"][data-column="${selectedCol}"]`)
            btn.setAttribute('data-marker', game.getActivePlayer().marker)
            game.playRound(selectedRow, selectedCol)
        }

        updatePlayerTurn()
    }

    const resetBoard = () => {
        boardDiv.replaceChildren()
        gameBoard.clearBoard()
        game.resetGame()
        render()
    }

    boardDiv.addEventListener('click', placeMarker)
    resetButton.addEventListener('click', resetBoard)


    render()
})()