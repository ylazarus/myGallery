'use strict'

function renderBoard(board) {
    //Render the board as a <table> to the page
    var cellNum = 1
    var strHTML = '<table border="0"><tbody oncontextmenu="return false;">';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j].minesAroundCount;
            if (!board[i][j].minesAroundCount) cell = NONE
            if (board[i][j].isMine) cell = MINE
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td id="${cellNum}" class="' + ${className} + '" onclick="cellClicked(this, ${i}, ${j})" onauxclick="cellMarked(this, ${i}, ${j})">  </td>`
            cellNum++
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(".board-container");
    elContainer.innerHTML = strHTML;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function startTimer() {
    gGameTimer = setInterval(countTimer, 1000);
}
function countTimer() {
    ++gGame.secsPassed
    var totalSeconds = gGame.secsPassed;
    // display as a string for zeros before num
    if (totalSeconds < 10)
        totalSeconds = "0" + totalSeconds;
    if (totalSeconds < 100)
        totalSeconds = "0" + totalSeconds;
    document.querySelector(".timer").innerText = totalSeconds;
}


function getNums(amount) {
    var numsArr = []
    for (var i = 1; i <= amount; i++) {
        var currNum = i
        numsArr.push(currNum)
    }
    return numsArr
}

function drawNum(array) {
    var idx = getRandomInt(0, array.length - 1)
    var num = array[idx]
    array.splice(idx, 1)
    return num
}

function copyBoard(board) {
    var newBoard = [];
    for (var i = 0; i < board.length; i++) {
        newBoard[i] = [];
        for (var j = 0; j < board[0].length; j++) {
            newBoard[i][j] = board[i][j];
        }
    }
    return newBoard;
}
