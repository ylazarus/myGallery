'use strict'
const PACMAN = '😷';
const PACMAN_IMG = '<img src="images/PAC-MAN.jpg" class="PAC-MAN" />'

var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 5,
            j: 7
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    if (!gGame.isOn) return
    // use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev)
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // return if cannot move
    if (nextCell === WALL) return
    // hitting a ghost?  call gameOver
    if (nextCell === GHOST) {
        if (gSuperMode) {
            var currGhost = getGhostByPos(nextLocation)
            ghostEaten(currGhost)
        } else {
            gameOver(false);
            return
        }
    }
    if (nextCell === CHERRY){
        updateScore(10)
    }
    if (nextCell === FOOD) {
        updateScore(1)
        gFoodEaten++
        if (gFoodEaten === gTotalFood) {
            gameOver(true)
        }
    }
    if (nextCell === SUPERFOOD) {
        if (gSuperMode) {
            return
        } else {
            updateScore(5)
            gSuperMode = true
            setTimeout(() => { gSuperMode = false }, 5000)
            setTimeout(() => { restoreGhosts() }, 5000)
        }
    }

    // moving from corrent position:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // Move the pacman to new location
    // update the model
    gPacman.location = {
        i: nextLocation.i,
        j: nextLocation.j
    }
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, PACMAN_IMG)
}



function getNextLocation(keyboardEvent) {
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    var elPacman = document.querySelector(".PAC-MAN")

    switch (keyboardEvent.code) {
        case 'ArrowUp':
            // elPacman.style.transform = "rotate (270deg)"
            nextLocation.i--
            break;
        case 'ArrowDown':
            // elPacman.style.transform = "rotate (90deg)"
            nextLocation.i++
            break;
            case 'ArrowLeft':
            // elPacman.style.transform = "rotate (180deg)"
            nextLocation.j--
            break;
        case 'ArrowRight':
            // elPacman.style.transform = "rotate (0deg)"
            nextLocation.j++
            break;
        default: return null
    }
    return nextLocation;
}