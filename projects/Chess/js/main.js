'use strict'

// Pieces Types
const KING_WHITE = '♔';
const QUEEN_WHITE = '♕';
const ROOK_WHITE = '♖';
const BISHOP_WHITE = '♗';
const KNIGHT_WHITE = '♘';
const PAWN_WHITE = '♙';
const KING_BLACK = '♚';
const QUEEN_BLACK = '♛';
const ROOK_BLACK = '♜';
const BISHOP_BLACK = '♝';
const KNIGHT_BLACK = '♞';
const PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    //build the board 8 * 8
    var board = [];
    for (var i = 0; i < 8; i++) {
        board[i] = [];
        for (var j = 0; j < 8; j++) {
            var piece = ''
            if (i === 1) piece = PAWN_BLACK;
            if (i === 6) piece = PAWN_WHITE;
            board[i][j] = piece;
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = QUEEN_BLACK;
    board[0][4] = KING_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = QUEEN_WHITE;
    board[7][4] = KING_WHITE;

    console.table(board);
    return board;

}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black';
            var tdId = `cell-${i}-${j}`;

            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">
                            ${cell}
                        </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {

    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell);
        cleanBoard();
        return;
    }

    cleanBoard();

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    // console.log('elCell.id: ', elCell.id);
    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            console.log('possibleCoords', possibleCoords);
            break;
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);

    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {

    var fromCoord = getCellCoord(elFromCell.id);
    var toCoord = getCellCoord(elToCell.id);

    // update the MODEL
    var piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j] = piece;
    // update the DOM
    elFromCell.innerText = '';
    elToCell.innerText = piece;

}

function markCells(coords) {
    console.log('coords', coords);
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
        elCell.classList.add('mark')
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];

    var diff = (isWhite) ? -1 : 1;
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else return res;

    if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
        diff *= 2;
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
        if (isEmptyCell(nextCoord)) res.push(nextCoord);
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1
    for (var idx = i; idx >= 0; idx--) {
        var coord = { i: idx, j: pieceCoord.j }

        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    var i = pieceCoord.i + 1
    for (var idx = i; idx < 8; idx++) {
        var coord = { i: idx, j: pieceCoord.j }

        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    var j = pieceCoord.j - 1
    for (var idx = j; idx >= 0; idx--) {
        var coord = { i: pieceCoord.i, j: idx }

        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    var j = pieceCoord.j + 1
    for (var idx = j; idx < 8; idx++) {
        var coord = { i: pieceCoord.i, j: idx }

        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    // console.log(res)
    // TODO: 3 more directions - the Bishop 
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    var i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j + 1; i <= 7 && idx < 8; idx++) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    var i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i <= 7 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    return res;
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var res = [];
//     var i = pieceCoord.i - 1;
//     for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
//         var coord = { i: i--, j: idx };
//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }
//     var i = pieceCoord.i - 1;
//     for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
//         var coord = { i: i--, j: idx };
//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }
//     var i = pieceCoord.i + 1;
//     for (var idx = pieceCoord.j + 1; i <= 7 && idx < 8; idx++) {
//         var coord = { i: i++, j: idx };
//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }
//     var i = pieceCoord.i + 1;
//     for (var idx = pieceCoord.j - 1; i <= 7 && idx >= 0; idx--) {
//         var coord = { i: i++, j: idx };
//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }

//     var i = pieceCoord.i - 1
//     for (var idx = i; idx >= 0; idx--) {
//         var coord = { i: idx, j: pieceCoord.j }

//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }
//     var i = pieceCoord.i + 1
//     for (var idx = i; idx < 8; idx++) {
//         var coord = { i: idx, j: pieceCoord.j }

//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }
//     var j = pieceCoord.j - 1
//     for (var idx = j; idx >= 0; idx--) {
//         var coord = { i: pieceCoord.i, j: idx }

//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }
//     var j = pieceCoord.j + 1
//     for (var idx = j; idx < 8; idx++) {
//         var coord = { i: pieceCoord.i, j: idx }

//         if (!isEmptyCell(coord)) break;
//         res.push(coord);
//     }

//     console.log(res);
//     return res;

    var res = []
    var diagonals = getAllPossibleCoordsBishop(pieceCoord)
    var linears = getAllPossibleCoordsRook(pieceCoord)
    res.push(...diagonals, ...linears)
    // var linString = linears.toString
    // res.push(linears)
    console.log(res)
    return res
}

function getAllPossibleCoordsKing(pieceCoord) {
    var res = []
    var rowIdx = pieceCoord.i
    var colIdx = pieceCoord.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > 7 - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > 7) continue
            if (i === rowIdx && j === colIdx) continue
            var coord = { i: i, j: j }

            if (!isEmptyCell(coord)) continue;
            res.push(coord);
        }
    }
    return res
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];

    return res;
}
