var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var CANDY = 'CANDY';

var CANDY_IMG = '<img src="img/candy.png" />';
var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;
var gEmptyCells
var gTimeoutBalls
var gTimeoutGlue
var gPlayerIsStuck = false
var gTotalBallsOnBoard = 2
var gBallsCollected = 0

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gTimeoutGlue = setInterval(placeCandy, 5000)
	gTimeoutBalls = setInterval(placeBall, 3000)

}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			if (i === 5 && (j === 0 || j === board[0].length - 1)) cell.type = FLOOR
			if (j === 5 && (i === 0 || i === board.length - 1)) cell.type = FLOOR


			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gPlayerIsStuck) return

	if (i === -1) i = gBoard.length - 1
	if (i === gBoard.length) i = 0
	if (j === -1) j = gBoard[0].length - 1
	if (j === gBoard[0].length) j = 0

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;



	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0) ||
		(iAbsDiff === gBoard.length - 1 && jAbsDiff === 0) ||
		(jAbsDiff === gBoard[0].length - 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			ballEaten();
		}

		if (targetCell.gameElement === CANDY) {
			candyEaten();
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	}

}
function ballEaten() {
	console.log('Collecting!')
	var audio = new Audio("sounds/bubble.wav")
	audio.play()
	gBallsCollected++
	var elCollected = document.querySelector(".counter span")
	elCollected.innerText = ` ${gBallsCollected}`
	gTotalBallsOnBoard--
	if (gTotalBallsOnBoard <= 0) {
		clearInterval(gTimeoutBalls)
		clearInterval(gTimeoutGlue)
		var elVictory = document.querySelector(".victory")
		elVictory.style.display = 'block'
		var elVictoryButton = document.querySelector(".victory-button")
		elVictoryButton.style.display = 'block'
	}
}

function candyEaten() {
	gPlayerIsStuck = true
	setTimeout(() => { gPlayerIsStuck = false }, 3000)
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function placeBall() {
	gEmptyCells = getEmptyCells()
	var cellToPut = gEmptyCells[getRandomInt(0, gEmptyCells.length - 1)]
	// update the model:
	gBoard[cellToPut.i][cellToPut.j].gameElement = BALL
	//cellToPut.gameElement = BALL
	renderCell(cellToPut, BALL_IMG)
	gTotalBallsOnBoard++
}
function placeCandy() {
	gEmptyCells = getEmptyCells()
	var cellToPut = gEmptyCells[getRandomInt(0, gEmptyCells.length - 1)]
	// update the model:
	gBoard[cellToPut.i][cellToPut.j].gameElement = CANDY
	renderCell(cellToPut, CANDY_IMG)

	setTimeout(() => { removeCandy(cellToPut.i, cellToPut.j, cellToPut) }, 3000)
}

function removeCandy(i, j, cellToPut) {
	if (gBoard[i][j].gameElement === GAMER) return
	gBoard[i][j].gameElement = null
	renderCell(cellToPut, '')
}

function getEmptyCells() {
	var emptyCells = []
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j]
			if (!currCell.gameElement && currCell.type === FLOOR) emptyCells.push({ i: i, j: j })
		}
	}
	return emptyCells
}


function resetGame() {
	gTotalBallsOnBoard = 2
	gBallsCollected = 0
	var elCollected = document.querySelector(".counter span")
	elCollected.innerText = ' 0'
	var elVictory = document.querySelector(".victory")
	elVictory.style.display = 'none'
	var elVictoryButton = document.querySelector(".victory-button")
	elVictoryButton.style.display = 'none'
	initGame()
}



