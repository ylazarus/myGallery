'use strict'
const MINE = '💣'
const FLAG = '🚩'
const NONE = ''
const SMILE = '😃'
const COOL = '😎'
const SAD = '😈'
const HURT = '🤕'

var gAllCellIds
var gGameTimer
var gBoard
var gMinesRemaining
// var capturedClicks =[]

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesLeft: 1
}

function initGame() {
    resetGame()
    gBoard = buildBoard()
    renderBoard(gBoard)
    renderHiScores()
}

function buildBoard() {
    var size = gLevel.size;
    var board = [];
    var cellNum = 1
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false, cellNum: cellNum }
            cellNum++
        }
    }
    return board;
}

function placeMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        var randomCellId = drawNum(gAllCellIds)
        placeMine(board, randomCellId)
    }
}

function placeMine(board, id) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].cellNum === id) board[i][j].isMine = true
        }
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = mineCounter(board, i, j)
        }
    }
}

function mineCounter(board, iPos, jPos) {
    var count = 0
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === iPos && j === jPos) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.secsPassed && !gGame.isOn) onFirstClick(currCell)
    if (!gGame.isOn) return
    if (currCell.isMarked || currCell.isShown) return
    if (!currCell.isMine) openCell(elCell, i, j)
    else if (currCell.isMine) mineClicked(elCell, i, j)

    checkGameOver()
}




function openCell(elCell, i, j) {
    var elSmile = document.querySelector(".smiley")
    if (elSmile.innerText !== SMILE) elSmile.innerText = SMILE
    var currCell = gBoard[i][j]

    if (currCell.minesAroundCount) {
        elCell.innerText = currCell.minesAroundCount
        currCell.isShown = true
        elCell.classList.add('is-shown')
    } else {
        expandShown(gBoard, i, j)
    }
}

function mineClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    gGame.livesLeft--
    gMinesRemaining--
    document.querySelector(".mines-remaining").innerText = gMinesRemaining
    currCell.isShown = true
    elCell.innerText = MINE
    elCell.classList.add('is-mine')
    document.querySelector(".smiley").innerText = HURT
    updateLivesElement()
    if (!gGame.livesLeft) gameLost()

}

function onFirstClick(currCell) {
    startTimer()
    gGame.isOn = true
    gAllCellIds = getNums(gLevel.size ** 2)
    // remove currCell from array so mine can't be placed there
    var currCellNum = currCell.cellNum
    var idx = gAllCellIds.indexOf(currCellNum)
    gAllCellIds.splice(idx, 1)

    placeMines(gBoard)
    setMinesNegsCount(gBoard)
}

function cellMarked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gGame.secsPassed && !gGame.isOn) onFirstClick()
    if (!gGame.isOn) return
    if (currCell.isShown) return
    if (currCell.isMarked) {
        currCell.isMarked = false
        elCell.innerText = NONE
        gMinesRemaining++
    } else {
        currCell.isMarked = true
        elCell.innerText = FLAG
        gMinesRemaining--
    }
    document.querySelector(".mines-remaining").innerText = gMinesRemaining

    checkGameOver()
}

function gameLost() {
    clearInterval(gGameTimer)
    gGame.isOn = false
    document.querySelector(".smiley").innerText = SAD
    // reveal all mines
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) {
                currCell.isShown = true
                document.getElementById(`${currCell.cellNum}`).innerText = MINE
            }
        }
    }
}

function checkGameOver() {
    if (gGame.livesLeft === 0) return
    var totalNotMines = gLevel.size ** 2 - gLevel.mines
    var shownCount = 0
    var correctlyMarkedCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown && !currCell.isMine) shownCount++
            if ((currCell.isMarked || currCell.isShown) && currCell.isMine) correctlyMarkedCount++
        }
    }
    if (shownCount === totalNotMines && correctlyMarkedCount === gLevel.mines) {
        clearInterval(gGameTimer)
        gGame.isOn = false
        document.querySelector(".smiley").innerText = COOL
        var score = gGame.secsPassed
        checkHighScore(score, gLevel.size)
    }
}

function checkHighScore(score, level) {
    var message = `Congratulations! ${score} is a new high score for this level on this computer! Type your name:`
    if (level === 4) {
        if (!localStorage.hiScoreEasy) {
            localStorage.hiScoreEasy = Number(score)
            localStorage.nameHiScoreEasy = prompt(message)
        } else {
            if (score < localStorage.hiScoreEasy) {
                localStorage.hiScoreEasy = Number(score);
                localStorage.nameHiScoreEasy = prompt(message)
            }
        }
    }
    if (level === 8) {
        if (!localStorage.hiScoreMedium) {
            localStorage.hiScoreMedium = Number(score)
            localStorage.nameHiScoreMedium = prompt(message)
        } else {
            if (score < localStorage.hiScoreMedium) {
                localStorage.hiScore = Number(score);
                localStorage.nameHiScoreMedium = prompt(message)
            }
        }
    }
    if (level === 12) {
        if (!localStorage.hiScoreHard) {
            localStorage.hiScoreHard = Number(score)
            localStorage.nameHiScoreHard = prompt(message)
        } else {
            if (score < localStorage.hiScoreHard) {
                localStorage.hiScoreHard = Number(score);
                localStorage.nameHiScoreHard = prompt(message)
            }
        }
    }
    renderHiScores()
}

function renderHiScores(){
    var text = ''
     if (localStorage.hiScoreEasy) text += `Easy: ${localStorage.nameHiScoreEasy}-${localStorage.hiScoreEasy}  ` 
     if (localStorage.hiScoreMedium) text += `Medium: ${localStorage.nameHiScoreMedium}-${localStorage.hiScoreMedium}  ` 
     if (localStorage.hiScoreHard) text += `Hard: ${localStorage.nameHiScoreHard}-${localStorage.hiScoreHard}`
    document.querySelector('.hi-scores').innerText = text
}

function expandShown(board, iPos, jPos) {
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            var currCell = board[i][j]
            if (currCell.isMarked) continue
            if (currCell.isShown) continue
            currCell.isShown = true
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.classList.add('is-shown')
            if (currCell.minesAroundCount) {
                elCurrCell.innerText = currCell.minesAroundCount
            } else if (!currCell.minesAroundCount) {
                expandShown(board, i, j)
            }
        }
    }
}

function chooseLevel(level) {
    if (level === 'easy') {
        gLevel.size = 4
        gLevel.mines = 2
    } else if (level === 'medium') {
        gLevel.size = 8
        gLevel.mines = 12
    } else if (level === 'hard') {
        gLevel.size = 12
        gLevel.mines = 30
    }
    initGame()
}

function resetGame() {
    clearInterval(gGameTimer)
    document.querySelector(".smiley").innerText = SMILE
    gMinesRemaining = gLevel.mines
    document.querySelector(".mines-remaining").innerText = gMinesRemaining
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    document.querySelector(".timer").innerText = '000'
    gGame.livesLeft = setLivesLeft()
    updateLivesElement()
}

function setLivesLeft() {
    if (gLevel.size === 4) return 1
    else if (gLevel.size === 8) return 2
    else return 3
}

function updateLivesElement() {
    var elLivesLeft = document.querySelector(".lives-left")
    if (gGame.livesLeft === 3) elLivesLeft.innerText = '3 lives'
    else if (gGame.livesLeft === 2) elLivesLeft.innerText = '2 lives'
    else if (gGame.livesLeft === 1) elLivesLeft.innerText = '1 life'
    else elLivesLeft.innerText = 'no lives'
}
