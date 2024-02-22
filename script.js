const gameBoard = (() => {
    const rows = 3
    const columns = 3
    const board = Array.from({ length: rows }, () =>
                new Array(columns).fill(0))

    const getBoard = () => board

    const addMarker = (marker, row, col) => {
        board[row][col] = marker
    }

    const printBoard = () => console.log(board.map(row => row.join(' ')).join('\n'))

    return {
        getBoard,
        addMarker,
        printBoard
    }
})()

