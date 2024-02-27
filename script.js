const gameBoard = (() => {
    const rows = 3
    const columns = 3
    const board = Array.from({ length: rows }, () =>
                new Array(columns).fill(0))

    const getBoard = () => board

    const addMarker = (marker, row, col) => {
        if(board[row][col] === 0) {
            board[row][col] = marker
        } else {
            console.log("Invalid cell")
        }
    }

    const cellAvailable = (row, col) => {
        return board[row][col] === 0 ? true : false
    }

    const printBoard = () => console.log(board.map(row => row.join(' ')).join('\n'))

    return {
        getBoard,
        addMarker,
        cellAvailable,
        transpose,
        printBoard
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

    const checkWinCondition = (board, marker) => {
        const matchingValue = (value) => value === marker

        for(let row of board) {
            if(row.every(matchingValue)) {
                console.log("Winning row")
                return true
            }
        }

        let transposedBoard = transpose(board)
        for(let row of transposedBoard) {
            if(row.every(matchingValue)) {
                console.log("Winning column")
                return true
            }
        }

        let mainDiagonal = Array.from(board, (row, index) => row[index])
        let antiDiagonal = Array.from(board, (row, index) => row[board.length - 1 - index])
        if(mainDiagonal.every(matchingValue) || antiDiagonal.every(matchingValue)) {
            console.log("Winning diagonal")
            return true
        }
    }

    const playRound = (row, col) => {
        console.log(`${getActivePlayer().name}'s turn - placing marker at [${col}][${row}]`)

        if(gameBoard.cellAvailable(row, col)) {
            gameBoard.addMarker(getActivePlayer().marker, row, col)
            gameBoard.printBoard()

            if(checkWinCondition(gameBoard.getBoard(), getActivePlayer().marker)) {
                console.log(`Game over! ${getActivePlayer().name} wins!`)
            } else {
                switchTurns()
                console.log(`Switching turns - ${getActivePlayer().name}'s turn`)
            }
            
        } else {
            console.log("Cell filled - try again")
        }
    }

    return {
        playRound
    }
})()

// Winning row
// game.playRound(0, 0)
// game.playRound(0, 0)
// game.playRound(1, 0)
// game.playRound(0, 1)
// game.playRound(2, 1)
// game.playRound(0, 2)

// Winning Column
// game.playRound(0, 0)
// game.playRound(0, 1)
// game.playRound(1, 0)
// game.playRound(0, 2)
// game.playRound(2, 0)

// Winning Diagonal
game.playRound(0, 0)
game.playRound(0, 1)
game.playRound(1, 1)
game.playRound(0, 2)
game.playRound(2, 2)
