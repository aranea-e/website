/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

const GRID_SIZE = 24;
const EDGE_MAX = GRID_SIZE - 1;
const PLAY_MIN = 1;
const PLAY_MAX = GRID_SIZE - 2;

function createCoverageGrid() {
	return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

let score = 0;

let inkCooldown = 0;

let playerPosition = { x: 12, y: 12 };
let playerArmPosition = [{ x: 11, y: 11 }, { x: 12, y: 11 }, { x: 13, y: 11 }, { x: 11, y: 12 }, { x: 13, y: 12 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 }];
let playerArmActive = [false, false, false, false, false, false, false, false];
let playerArmDestroyed = [false, false, false, false, false, false, false, false];

let armPositionRelative = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }];

let armSprites = ["\\", "║", "//", "=", "=", "//", "║", "\\"];

let inkCoverage = createCoverageGrid();

let PLAYER = 0;

let inkTimer = null;
let tickTimer = null;

let fishTimers = [null, null, null, null, null, null, null, null, null, null];
let fishPos = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
let firstFishTimer = 0;
let spawnCooldown = 6;

PS.init = function (system, options) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize(GRID_SIZE, GRID_SIZE);

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText("Squid Game");
	render();
	updateStatus();

	tickTimer = PS.timerStart(10, tick);

	// Add any other initialization code you need here.
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function (x, y, data, options) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function (x, y, data, options) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function (x, y, data, options) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function (x, y, data, options) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function (options) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function (key, shift, ctrl, options) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" + "Player Position: " + playerPosition.x + ", " + playerPosition.y + "\n");

	// Add code here for when a key is pressed.

	// W key
	if (((key == 119 && shift == false) || (key == 87 && shift == true)) && playerPosition.y > PLAY_MIN) {
		for (let i = 0; i < playerArmPosition.length; i++) {
			if (armAttatched(i, PLAYER)) {
				playerArmPosition[i].y -= 1;
			}
		}
		playerPosition.y -= 1;
	}

	// A key
	if (((key == 97 && shift == false) || (key == 65 && shift == true)) && playerPosition.x > PLAY_MIN) {
		for (let i = 0; i < playerArmPosition.length; i++) {
			if (armAttatched(i, PLAYER)) {
				playerArmPosition[i].x -= 1;
			}
		}
		playerPosition.x -= 1;
	}

	// S key
	if (((key == 115 && shift == false) || (key == 83 && shift == true)) && playerPosition.y < PLAY_MAX) {
		for (let i = 0; i < playerArmPosition.length; i++) {
			if (armAttatched(i, PLAYER)) {
				playerArmPosition[i].y += 1;
			}
		}
		playerPosition.y += 1;
	}

	// D key
	if (((key == 100 && shift == false) || (key == 68 && shift == true)) && playerPosition.x < PLAY_MAX) {
		for (let i = 0; i < playerArmPosition.length; i++) {
			if (armAttatched(i, PLAYER)) {
				playerArmPosition[i].x += 1;
			}
		}
		playerPosition.x += 1;
	}

	// Space key
	if (key == 32 && inkCooldown == 0) {
		for (let i = -4; i < 5; i++) {
			for (let j = -4; j < 5; j++) {
				if (playerPosition.x + i >= 0 && playerPosition.x + i < GRID_SIZE && playerPosition.y + j >= 0 && playerPosition.y + j < GRID_SIZE) {
					inkCoverage[playerPosition.x + i][playerPosition.y + j] = 1;
				}
			}
		}

		inkCooldown = 29;
		updateStatus();
		if (inkTimer != null) PS.timerStop(inkTimer);
		inkTimer = PS.timerStart(10, dissolveInk);
	}

	// T key
	if (((key == 116 && shift == false) || (key == 84 && shift == true)) && armAttatched(0, PLAYER)) {
		playerArmActive[0] = !playerArmActive[0];
	}

	// Y key
	if (((key == 121 && shift == false) || (key == 89 && shift == true)) && armAttatched(1, PLAYER)) {
		playerArmActive[1] = !playerArmActive[1];
	}

	// U key
	if (((key == 117 && shift == false) || (key == 85 && shift == true)) && armAttatched(2, PLAYER)) {
		playerArmActive[2] = !playerArmActive[2];
	}

	// G key
	if (((key == 103 && shift == false) || (key == 71 && shift == true)) && armAttatched(3, PLAYER)) {
		playerArmActive[3] = !playerArmActive[3];
	}

	// J key
	if (((key == 106 && shift == false) || (key == 74 && shift == true)) && armAttatched(4, PLAYER)) {
		playerArmActive[4] = !playerArmActive[4];
	}

	// B key
	if (((key == 98 && shift == false) || (key == 66 && shift == true)) && armAttatched(5, PLAYER)) {
		playerArmActive[5] = !playerArmActive[5];
	}

	// N key
	if (((key == 110 && shift == false) || (key == 78 && shift == true)) && armAttatched(6, PLAYER)) {
		playerArmActive[6] = !playerArmActive[6];
	}

	// M key
	if (((key == 109 && shift == false) || (key == 77 && shift == true)) && armAttatched(7, PLAYER)) {
		playerArmActive[7] = !playerArmActive[7];
	}

	render();
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function (key, shift, ctrl, options) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function (sensors, options) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};

function tick() {

	for (let i = 0; i < playerArmActive.length; i++) {
		if (!playerArmDestroyed[i]) {
			if (playerArmActive[i]) {
				if (playerArmPosition[i].x + armPositionRelative[i].x > 0
					&& playerArmPosition[i].x + armPositionRelative[i].x < GRID_SIZE
					&& playerArmPosition[i].y + armPositionRelative[i].y > 0
					&& playerArmPosition[i].y + armPositionRelative[i].y < GRID_SIZE) {

					playerArmPosition[i].x += armPositionRelative[i].x;
					playerArmPosition[i].y += armPositionRelative[i].y;

				} else {
					playerArmActive[i] = false;
				}
			} else {
				let armTarget = { x: playerPosition.x + armPositionRelative[i].x, y: playerPosition.y + armPositionRelative[i].y };
				if (armTarget.x > playerArmPosition[i].x) playerArmPosition[i].x += 1;
				if (armTarget.x < playerArmPosition[i].x) playerArmPosition[i].x -= 1;
				if (armTarget.y > playerArmPosition[i].y) playerArmPosition[i].y += 1;
				if (armTarget.y < playerArmPosition[i].y) playerArmPosition[i].y -= 1;
			}
		}
	}

	if (inkCooldown > 0) inkCooldown -= 1;
	if (spawnCooldown > 0) spawnCooldown -= 1;
	if (spawnCooldown == 0) {
		spawnFish();
		spawnCooldown = 6 + PS.random(12);
	}

	render();
}

function render() {
	for (let i = 0; i < playerArmPosition.length; i++) {
		for (let j = 0; j < fishTimers.length; j++) {
			if (fishTimers[j] != null && Math.abs(playerArmPosition[i].x - fishPos[j].x) <= 1 && Math.abs(playerArmPosition[i].y - fishPos[j].y) <= 1) {
				PS.timerStop(fishTimers[j]);
				fishTimers[j] = null;
				if (j < firstFishTimer) firstFishTimer = j;
				score += 1;
			}
		}
	}

	for (let x = 0; x < GRID_SIZE; x++) {
		for (let y = 0; y < GRID_SIZE; y++) {
			if (x == 0 || y == 0 || x == EDGE_MAX || y == EDGE_MAX) {
				PS.color(x, y, PS.COLOR_GRAY);
				PS.glyph(x, y, 0);
				continue;
			} else {
				PS.color(x, y, PS.COLOR_BLUE);
				PS.glyph(x, y, 0);
			}
		}
	}

	PS.color(playerPosition.x, playerPosition.y, PS.COLOR_GREEN);
	PS.glyph(playerPosition.x, playerPosition.y, "¶");

	for (let i = 0; i < playerArmPosition.length; i++) {
		if (!playerArmDestroyed[i]) {
			if (armAttatched(i, PLAYER)) {
				PS.color(playerArmPosition[i].x, playerArmPosition[i].y, PS.COLOR_GREEN);
				PS.glyph(playerArmPosition[i].x, playerArmPosition[i].y, armSprites[i]);
			} else {
				PS.color(playerArmPosition[i].x, playerArmPosition[i].y, 0, 128, 0);
				PS.glyph(playerArmPosition[i].x, playerArmPosition[i].y, armSprites[i]);
			}
		}
	}

	for (let i = 0; i < fishTimers.length; i++) {
		if (fishTimers[i] != null) {
			PS.color(fishPos[i].x, fishPos[i].y, PS.COLOR_YELLOW);
			PS.glyph(fishPos[i].x, fishPos[i].y, "¤");
		}
	}

	for (let x = 0; x < GRID_SIZE; x++) {
		for (let y = 0; y < GRID_SIZE; y++) {
			if (inkCoverage[x][y] == 1) {
				PS.color(x, y, PS.COLOR_BLACK);
				PS.glyph(x, y, 0);
				continue;
			}
		}
	}

	updateStatus();
}

function armAttatched(i, player) {
	if (playerArmPosition[i].x == playerPosition.x + armPositionRelative[i].x && playerArmPosition[i].y == playerPosition.y + armPositionRelative[i].y) {
		return true;
	}
	return false;
}

function dissolveInk() {
	let newCoverage = createCoverageGrid();
	for (let x = 0; x < GRID_SIZE; x++) {
		for (let y = 0; y < GRID_SIZE; y++) {
			if (inkCoverage[x][y] == 1) {
				let surroundingInk = 0;
				if (x > 0 && y > 0 && inkCoverage[x - 1][y - 1] == 1) surroundingInk++;
				if (x > 0 && inkCoverage[x - 1][y] == 1) surroundingInk++;
				if (x > 0 && y < EDGE_MAX && inkCoverage[x - 1][y + 1] == 1) surroundingInk++;
				if (y > 0 && inkCoverage[x][y - 1] == 1) surroundingInk++;
				if (y < EDGE_MAX && inkCoverage[x][y + 1] == 1) surroundingInk++;
				if (x < EDGE_MAX && y > 0 && inkCoverage[x + 1][y - 1] == 1) surroundingInk++;
				if (x < EDGE_MAX && inkCoverage[x + 1][y] == 1) surroundingInk++;
				if (x < EDGE_MAX && y < EDGE_MAX && inkCoverage[x + 1][y + 1] == 1) surroundingInk++;

				if (surroundingInk > Math.min(PS.random(5), PS.random(5))) {
					newCoverage[x][y] = 1;
				}
			}
		}
	}

	inkCoverage = newCoverage;
	render();
}

function updateStatus() {
	if (inkCooldown > 0) {
		PS.statusText("Score: " + score + " | Ink Cooldown: " + Math.ceil(inkCooldown / 6));
	} else {
		PS.statusText("Score: " + score + " | Ink Ready");
	}
}

function spawnFish() {
	if (firstFishTimer >= fishTimers.length) {
		return;
	}

	if (firstFishTimer % 2 == 0) {
		fishTimers[firstFishTimer] = PS.timerStart(10, fishAct.bind(null, 0, firstFishTimer));
		fishPos[firstFishTimer].x = 0;
		fishPos[firstFishTimer].y = PS.random(PLAY_MAX) + PLAY_MIN;
	} else {
		fishTimers[firstFishTimer] = PS.timerStart(10, fishAct.bind(null, 1, firstFishTimer));
		fishPos[firstFishTimer].x = 23;
		fishPos[firstFishTimer].y = PS.random(PLAY_MAX) + PLAY_MIN;
	}

	while (firstFishTimer < fishTimers.length && fishTimers[firstFishTimer] != null) {
		firstFishTimer++;
	}
}

function fishAct(direction, index) {
	if (direction == 0) {
		fishPos[index].x += 1;
		if (fishPos[index].x > EDGE_MAX) {
			PS.timerStop(fishTimers[index]);
			fishTimers[index] = null;
			if (index < firstFishTimer) firstFishTimer = index;
		}
	} else {
		fishPos[index].x -= 1;
		if (fishPos[index].x < 0) {
			PS.timerStop(fishTimers[index]);
			fishTimers[index] = null;
			if (index < firstFishTimer) firstFishTimer = index;
		}
	}

	if (seeSquid(index)) {
		if (playerPosition.y > fishPos[index].y) {
			fishPos[index].y -= 1;
			if (fishPos[index].y < 0) {
				PS.timerStop(fishTimers[index]);
				fishTimers[index] = null;
				if (index < firstFishTimer) firstFishTimer = index;
			}
		} else {
			fishPos[index].y += 1;
			if (fishPos[index].y > EDGE_MAX) {
				PS.timerStop(fishTimers[index]);
				fishTimers[index] = null;
				if (index < firstFishTimer) firstFishTimer = index;
			}
		}
	}
}

function seeSquid(index) {
	return (inkCoverage[playerPosition.x][playerPosition.y] != 1) && (Math.abs(playerPosition.x - fishPos[index].x) <= 6) && (Math.abs(playerPosition.y - fishPos[index].y) <= 6);
}