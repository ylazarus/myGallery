'use strict'
const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPERFOOD = '🍺'
const CHERRY = '🍒'

var gBoard;
var gTotalFood = 56
var gFoodEaten = 0
var gSuperMode = false
var gCherryInterval

var gGame = {
    score: 0,
    isOn: false
}

function init() {
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame.isOn = true
    gCherryInterval = setInterval(placeCherry, 15000)
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
            if ((i === 1 || i === SIZE - 2) && (j === 1 || j === SIZE - 2)) {
                board[i][j] = SUPERFOOD
            }
        }
    }
    return board;
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;
}

function gameOver(isWon) {
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elModalSpan = elModal.querySelector('span')
    elModalSpan.innerText = (isWon) ? 'Victory!' : 'You Lose!'
}

function placeCherry() {
    var emptyCells = getEmptyCells()
    var cellToPut = emptyCells[getRandomInt(0, emptyCells.length - 1)]
    // update the model:
    gBoard[cellToPut.i][cellToPut.j] = CHERRY
    //cellToPut.gameElement = BALL
    renderCell(cellToPut, CHERRY)
}

function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell === EMPTY) emptyCells.push({ i: i, j: j })
        }
    }
    return emptyCells
}

function resetGame() {
    gFoodEaten = 0
    gSuperMode = false
    gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score;
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    init()
}