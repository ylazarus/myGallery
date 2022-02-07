'use strict'
const GHOST = '&#9781;';
var gGhosts;
var gIntervalGhosts;
var gEatenGhosts = []


function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;

}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = [];
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }

    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // console.log('ghost.location', ghost.location)
    // figure out moveDiff, nextLocation, nextCell
    if (gGhosts.indexOf(ghost) === -1) return
    var moveDiff = getMoveDiff()
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    }

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    // hitting a pacman?  call gameOver
    if (nextCell === PACMAN) {
        if (gSuperMode) {
            ghostEaten(ghost)
            return
        } else {
            gameOver();
            return
        }
    }

    // moving from corrent position:
    // update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location
    // update the model
    ghost.location = {
        i: nextLocation.i,
        j: nextLocation.j
    }
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function ghostEaten(toBeEaten) {
    var idx = gGhosts.indexOf(toBeEaten)
    console.log('idx of ghost', idx); 
    var eatenGhost = gGhosts.splice(idx, 1)
    console.log('gGhosts', gGhosts);
    gEatenGhosts.push(eatenGhost[0])
}

function restoreGhosts() {
    for (var i = 0 ; i < gEatenGhosts.length; i++){
    gGhosts.push(gEatenGhosts[i])
    }
    gEatenGhosts = []
}

function getGhostHTML(ghost) {
    if (gSuperMode) {
        return `<span style="color:blue;">${GHOST}</span>`
    } else {
        return `<span style="color:${ghost.color};">${GHOST}</span>`
    }
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 }
    } else if (randNum <= 50) {
        return { i: -1, j: 0 }
    } else if (randNum <= 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostByPos(location) {
    // gets {i:  j: } of location of ghost
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location === location)
            return gGhosts[i]
    }
}