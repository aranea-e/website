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

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

let tickrate = 15;
let age = 0;
let timer = null;
let tiles = null;
let adjTiles = null;
let paused = false;

let draw = [1, false];

PS.init = function( system, options ) {
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

	PS.gridSize( 8, 8 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	initializeGrid();
	setTickRate( tickrate );
	tick();
	startGame();

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

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.

	draw[1] = true;
	// PS.debug(draw);
	set(x, y, draw[0]);
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

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.

	draw[1] = false;
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

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
	if (draw[1]) {
		set(x, y, draw[0]);
	}
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

PS.exit = function( x, y, data, options ) {
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

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.

	draw[1] = false;
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

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// Add code here for when a key is pressed.

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	if (key === 43 || key === 61) { // '+' key
		setTickRate( tickrate + 1 );
	} else if (key === 173) { // '-' key
		setTickRate( tickrate - 1 );
	}
	
	if (key === 111 || key === 97) { // 'o' key
		PS.gridSize(PS.gridSize().width - 1, PS.gridSize().height);
		initializeGrid();
		age = 0;
		render();
	} else if (key === 112 || key === 80) { // 'p' key
		PS.gridSize( PS.gridSize().width + 1, PS.gridSize().height );
		initializeGrid();
		age = 0;
		render();
	}
	
	if (key === 91 || key === 123) { // '{' key
		PS.gridSize(PS.gridSize().width, PS.gridSize().height - 1);
		initializeGrid();
		age = 0;
		render();
	} else if (key === 93 || key === 125) { // '}' key
		PS.gridSize( PS.gridSize().width, PS.gridSize().height + 1 );
		initializeGrid();
		age = 0;
		render();
	}
	
	if (key === 120 || key === 88) { // 'x' key
		initializeGrid();
		age = 0;
		render();
	}
	
	if (key === 122 || key === 90) { // 'z' key
		exampleGrid();
		age = 0;
		render();
	}

	if (key === 32) { // space key
		paused = !paused;
		setTickRate(tickrate);
	}

	// numkeys

	if (key === 49 || key === 33) { // '1' key
		draw[0] = 0;
	}
	else if (key === 50 || key === 64) { // '2' key
		draw[0] = 1;
	}
	else if (key === 51 || key === 35) { // '3' key
		draw[0] = 2;
	}
	else if (key === 52 || key === 36) { // '4' key
		draw[0] = 3;
	}
	else if (key === 53 || key === 37) { // '5' key
		draw[0] = 4;
	}
	else if (key === 54 || key === 94) { // '6' key
		draw[0] = 5;
	}
	else if (key === 55 || key === 38) { // '7' key
		draw[0] = 6;
	}

	updateStatus();
	stopGame();
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

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.

	if (!paused) startGame();
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

function setTickRate( x ) {
	if (x > 0 && x <= 600) {
		tickrate = x;
		updateStatus();
		return x;
	}
	return -1;
}

function stopGame() {
	if (timer !== null)
		PS.timerStop(timer);
	timer = null;
}

function startGame() {
	if (timer !== null)
		PS.timerStop(timer);
	timer = PS.timerStart( tickrate, tick );
}

function tick() {
	age++;
	simulate();
	render();
}

function updateStatus() {
	if (paused) {
		PS.statusText( "PAUSED | Tickrate: " + tickrate + " | Selected: " + (draw[0] + 1) + " | Age: " + age );
		return;
	}
	PS.statusText( "Tickrate: " + tickrate + " | Selected: " + (draw[0] + 1) + " | Age: " + age );
}

function set(x, y, value) {
	tiles[x][y] = value;
	render();
}

function render() {
	for (let i = 0; i < tiles.length; i++) {
		const element = tiles[i];
		for (let j = 0; j < element.length; j++) {
			const tile = element[j];
			if (tile === 0) {
				PS.color( i, j, PS.COLOR_WHITE);
			} else if (tile === 1){
				PS.color( i, j, PS.COLOR_BLACK);
			} else if (tile === 2){
				PS.color( i, j, PS.COLOR_RED);
			} else if (tile === 3){
				PS.color( i, j, PS.COLOR_BLUE);
			} else if (tile === 4){
				PS.color( i, j, PS.COLOR_YELLOW);
			} else if (tile === 5){
				PS.color( i, j, PS.COLOR_GREEN);
			} else if (tile === 6){
				PS.color( i, j, PS.COLOR_MAGENTA);
			}
		}
	}

	updateStatus();
}

function simulate() {
	updateAdjacent();
	updateGrid();
}

function updateAdjacent() {
	for (let i = 0; i < tiles.length; i++) {
		const element = tiles[i];
		for (let j = 0; j < element.length; j++) {
			const tile = element[j];
			adjTiles[i][j] = colorsAdjacent(i, j);
		}
	}
}

function colorsAdjacent(x, y) {
	let colors = [false, false, false, false, false, false, false]; // white, black, red, blue, yellow, green, purple
	let leftx = x - 1;
	if (leftx < 0) leftx = PS.gridSize().width - 1;
	if (leftx > PS.gridSize().width - 1) leftx = 0;
	let rightx = x + 1;
	if (rightx < 0) rightx = PS.gridSize().width - 1;
	if (rightx > PS.gridSize().width - 1) rightx = 0;
	let upy = y - 1;
	if (upy < 0) upy = PS.gridSize().height - 1;
	if (upy > PS.gridSize().height - 1) upy = 0;
	let downy = y + 1;
	if (downy < 0) downy = PS.gridSize().height - 1;
	if (downy > PS.gridSize().height - 1) downy = 0;

	if (tiles[x][upy]) colors[tiles[x][upy]] = true;
	if (tiles[leftx][y]) colors[tiles[leftx][y]] = true;
	if (tiles[rightx][y]) colors[tiles[rightx][y]] = true;
	if (tiles[x][downy]) colors[tiles[x][downy]] = true;

	return colors;
}

function updateGrid() {
	for (let i = 0; i < tiles.length; i++) {
		const element = tiles[i];
		for (let j = 0; j < element.length; j++) {
			const tile = element[j];
			updateTile(i, j);
		}
	}
}

function updateTile(x, y) {
	let colors = adjTiles[x][y];
	if (tiles[x][y] == 0) { // white: taken over by all colors other than black. Red beats yellow, yellow beats blue, blue beats red. Green beats all other than purple. Purple beats green.
		if (colors[2] && !colors[3] && !colors[5]) { // red and not blue or green
			tiles[x][y] = 2;
		} else if (colors[3] && !colors[4] && !colors[5]) { // blue and not yellow or green
			tiles[x][y] = 3;
		} else if (colors[4] && !colors[2] && !colors[5]) { // yellow and not red or green
			tiles[x][y] = 4;
		} else if (colors[5] && !colors[6]) { // green and not purple
			tiles[x][y] = 5;
		} else if (colors[6] && !colors[2] && !colors[3] && !colors[4]) { // purple and not red, blue, or yellow
			tiles[x][y] = 6;
		}

	} else if (tiles[x][y] == 1){ // black: do nothing
		return;
	} else if (tiles[x][y] == 2){ // red: loses to blue or green (priority green)
		if (colors[5]) { // green
			tiles[x][y] = 5;
		} else if (colors[3]) { // blue
			tiles[x][y] = 3;
		}
	} else if (tiles[x][y] == 3){ // blue: loses to yellow or green (priority green)
		if (colors[5]) { // green
			tiles[x][y] = 5;
		} else if (colors[4]) { // yellow
			tiles[x][y] = 4;
		}
	} else if (tiles[x][y] == 4){ // yellow: loses to red or green (priority green)
		if (colors[5]) { // green
			tiles[x][y] = 5;
		} else if (colors[2]) { // red
			tiles[x][y] = 2;
		}
	} else if (tiles[x][y] == 5){ // green: loses to purple.
		if (colors[6]) { // purple
			tiles[x][y] = 6;
		}
	} else if (tiles[x][y] == 6){ // purple: loses to red, blue, or yellow
		if (colors[2] || colors[3] || colors[4]) { // red, blue, or yellow
			if (colors[2] && !colors[3]) { // red and not blue
				tiles[x][y] = 2;
			} else if (colors[3] && !colors[4]) { // blue and not yellow
				tiles[x][y] = 3;
			} else if (colors[4] && !colors[2]) { // yellow and not red
				tiles[x][y] = 4;
			}
		}
	}

}

function initializeGrid() {
	tiles = Array.from({ length: PS.gridSize().width }, () => new Array(PS.gridSize().height).fill(0));
	adjTiles = Array.from({ length: PS.gridSize().width }, () => new Array(PS.gridSize().height).fill([false, false, false, false, false, false, false]));
}

function exampleGrid() {
	PS.gridSize(12, 15);

	tiles = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 1],
		[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
		[1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 0, 4, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 1, 1, 1, 0, 0, 0, 4, 0, 0, 1, 6, 1],
		[1, 0, 1, 1, 1, 1, 0, 0, 2, 3, 0, 0, 1, 0, 1],
		[1, 6, 1, 0, 6, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 2, 5, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
		[1, 0, 5, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	];
	adjTiles = Array.from({ length: PS.gridSize().width }, () => new Array(PS.gridSize().height).fill([false, false, false, false, false, false, false]));
}