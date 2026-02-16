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

let gameTimer = null;


/*
Tile Grid Legend:
0 = empty
1 = player start
2 = goal
3 = rotate north
4 = rotate south
5 = rotate east
6 = rotate west
7 = rotate right
8 = rotate left
9 = death
10 = launch north
11 = launch south
12 = launch east
13 = launch west
14 = launch forward
15 = launch backward
16 = wall
*/
let levels = [ [ [ 0, 0, 0, 0, 0],
			     [ 0, 0, 0, 0, 0],
			     [ 1, 0, 0, 0, 2],
			     [ 0, 0, 0, 0, 0],
			     [ 0, 0, 0, 0, 0] ], 1,

			   [ [ 1, 0, 5,16, 0],
			     [ 0, 0, 0,16, 0],
			     [ 0,16, 0,16, 0],
			     [ 0,16, 0, 0, 0],
			     [ 0,16, 4, 0, 2] ], 1,
				
			   [ [ 0, 0, 2, 0, 0],
			     [ 0, 0, 0, 0, 0],
			     [ 1, 0, 7,16, 0],
			     [ 0, 0,16,16, 0],
			     [ 0, 0, 0, 0, 0] ], 1,

			   [ [ 0, 0, 0,16, 0, 0, 0],
			     [ 0, 0, 0,16, 0, 0, 2],
			     [ 1, 0,10,16,14, 0, 0],
			     [ 0, 0, 0,16, 0, 0, 0],
			     [ 0, 0, 0,16, 0, 0, 0] ], 1,
				
			   [ [ 0, 0, 0, 0, 0],
			     [ 0, 9, 0, 7, 2],
			     [ 0, 0,16, 0, 0],
			     [ 1, 4,16, 3, 0],
			     [ 0, 0,16, 0, 0] ], 1,
				
			   [ [ 0, 0, 0, 0, 0],
			     [ 0, 9, 0, 0, 2],
			     [ 0, 0,16, 0, 0],
			     [ 1, 4,16, 8, 0],
			     [ 0, 0,16, 0, 0] ], 1,

			   [ [ 0, 0,16, 0, 2],
			     [ 0,11, 0, 9, 0],
			     [16, 0,16, 0,16],
			     [ 1, 8, 0,11, 0],
			     [ 0, 0,16, 0, 0] ], 1,

			   [ [ 0, 0, 0,16, 0, 2],
			     [ 0, 0, 0,16, 0, 0],
				 [12, 0, 0,16, 9, 0],
			     [ 3, 0,14,16, 7, 0],
			     [ 0, 0, 0,16, 0, 0],
			     [ 1, 0, 0,16, 0, 0] ], 0,

			   [ [ 0, 0, 0, 4, 0, 0, 1],
			     [ 0, 0, 9, 0, 9, 0, 0],
			     [ 0, 3, 0, 0, 0, 4, 0],
			     [ 0, 9, 0, 0, 0, 9, 0],
				 [ 0, 0, 0,0, 0, 0, 0],
			     [ 9, 0,12, 2, 9, 0,13],
			     [ 0, 0, 9,16, 9, 0, 0],
			     [ 0,10, 0, 0, 0,11, 0],
			     [ 0, 0, 0, 9, 0, 0, 0] ], 2,
				
			   [ [ 6, 0, 7, 0, 9, 0,16],
			     [ 0, 0, 0, 0, 0, 0, 0],
			     [ 8,16, 9, 0, 7,16, 9],
			     [ 0, 0, 0, 0, 0, 0, 0],
				 [ 1, 0, 8, 0, 7, 0, 2] ], 0,];

let level = 0;
let MAX_LEVEL = levels.length;

let tileGrid = null;

let pause = true;

let direction = null; // 0 = north, 1 = east, 2 = south, 3 = west

let launch = null;

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

	PS.gridSize( 1, 1 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	loadLevel( level );
	gameTimer = PS.timerStart( 20, step );
	render();

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

	if ( !pause ) {
		return;
	}

	switch ( tileGrid[y][x] ) {
		case 3: // rotate north
			tileGrid[y][x] = 5;
			break;
		case 4: // rotate south
			tileGrid[y][x] = 6;
			break;
		case 5: // rotate east
			tileGrid[y][x] = 4;
			break;
		case 6: // rotate west
			tileGrid[y][x] = 3;
			break;
		case 7: // rotate right
			tileGrid[y][x] = 8;
			break;
		case 8: // rotate left
			tileGrid[y][x] = 7;
			break;
		case 10: // launch north
			tileGrid[y][x] = 12;
			break;
		case 11: // launch south
			tileGrid[y][x] = 13;
			break;
		case 12: // launch east
			tileGrid[y][x] = 11;
			break;
		case 13: // launch west
			tileGrid[y][x] = 10;
			break;
		// case 14: // launch forward
		// 	tileGrid[y][x] = 15;
		// 	break;
		// case 15: // launch backward
		// 	tileGrid[y][x] = 14;
		// 	break;
	}
	render();
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

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.

	if ( !pause ) {
		return;
	}

	// Arrow Up
	if ( key === PS.KEY_ARROW_UP ) {
		// For each column, shift tiles up
		for ( let x = 0; x < tileGrid[0].length; x++ ) {
			let firstTile = -1;
			let firstTilePos = [-1, -1];
			for ( let y = tileGrid.length - 1; y >= 0; y-- ) {
				if ( tileGrid[y][x] > 2 && tileGrid[y][x] !== 16) {
					if ( firstTile === -1 ) {
						firstTile = tileGrid[y][x];
						firstTilePos = [y, x];
						tileGrid[y][x] = 0;
					} else {
						let temp = tileGrid[y][x];
						tileGrid[y][x] = firstTile;
						firstTile = temp;
					}
				}
			}
			if ( firstTilePos[0] !== -1 ) {
				tileGrid[firstTilePos[0]][firstTilePos[1]] = firstTile;
			}
		}
	}

	// Arrow Down
	if ( key === PS.KEY_ARROW_DOWN ) {
		// For each column, shift tiles down
		for ( let x = 0; x < tileGrid[0].length; x++ ) {
			let firstTile = -1;
			let firstTilePos = [-1, -1];
			for ( let y = 0; y < tileGrid.length; y++ ) {
				if ( tileGrid[y][x] > 2 && tileGrid[y][x] !== 16) {
					if ( firstTile === -1 ) {
						firstTile = tileGrid[y][x];
						firstTilePos = [y, x];
						tileGrid[y][x] = 0;
					} else {
						let temp = tileGrid[y][x];
						tileGrid[y][x] = firstTile;
						firstTile = temp;
					}
				}
			}
			if ( firstTilePos[0] !== -1 ) {
				tileGrid[firstTilePos[0]][firstTilePos[1]] = firstTile;
			}
		}
	}

	// Arrow Left
	if ( key === PS.KEY_ARROW_LEFT ) {
		// For each row, shift tiles left
		for ( let y = 0; y < tileGrid.length; y++ ) {
			let firstTile = -1;
			let firstTilePos = [-1, -1];
			for ( let x = tileGrid[y].length - 1; x >= 0; x-- ) {
				if ( tileGrid[y][x] > 2 && tileGrid[y][x] !== 16) {
					if ( firstTile === -1 ) {
						firstTile = tileGrid[y][x];
						firstTilePos = [y, x];
						tileGrid[y][x] = 0;
					} else {
						let temp = tileGrid[y][x];
						tileGrid[y][x] = firstTile;
						firstTile = temp;
					}
				}
			}
			if ( firstTilePos[0] !== -1 ) {
				tileGrid[firstTilePos[0]][firstTilePos[1]] = firstTile;
			}
		}
	}

	// Arrow Right
	if ( key === PS.KEY_ARROW_RIGHT ) {
		// For each row, shift tiles right
		for ( let y = 0; y < tileGrid.length; y++ ) {
			let firstTile = -1;
			let firstTilePos = [-1, -1];
			for ( let x = 0; x < tileGrid[y].length; x++ ) {
				if ( tileGrid[y][x] > 2 && tileGrid[y][x] !== 16) {
					if ( firstTile === -1 ) {
						firstTile = tileGrid[y][x];
						firstTilePos = [y, x];
						tileGrid[y][x] = 0;
					} else {
						let temp = tileGrid[y][x];
						tileGrid[y][x] = firstTile;
						firstTile = temp;
					}
				}
			}
			if ( firstTilePos[0] !== -1 ) {
				tileGrid[firstTilePos[0]][firstTilePos[1]] = firstTile;
			}
		}
	}

	// Spacebar
	if ( key === PS.KEY_SPACE ) {
		pause = false;
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

PS.keyUp = function( key, shift, ctrl, options ) {
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

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

function step() {
	if ( !pause ) {
		simulate();
	}
	render();
}

function simulate() {
	// Simulate one step of the game
	let playerpos = [-1, -1];
	for ( let y = 0; y < tileGrid.length; y++ ) {
		for ( let x = 0; x < tileGrid[y].length; x++ ) {
			if ( tileGrid[y][x] === 1 ) {
				playerpos = [y, x];
			}
		}
	}

	tileGrid[playerpos[0]][playerpos[1]] = 0;

	if ( launch !== null ) {
		switch ( launch ) {
			case 0: // north
				playerpos[0]--;
				break;
			case 1: // east
				playerpos[1]++;
				break;
			case 2: // south
				playerpos[0]++;
				break;
			case 3: // west
				playerpos[1]--;
				break;
			case 4: // forward
				switch (direction) {
					case 0: // north
						playerpos[0] -= 2;
						break;
					case 1: // east
						playerpos[1] += 2;
						break;
					case 2: // south
						playerpos[0] += 2;
						break;
					case 3: // west
						playerpos[1] -= 2;
						break;
				}
				break;
			case 5: // backward
				switch (direction) {
					case 0: // north
						playerpos[0] += 2;
						break;
					case 1: // east
						playerpos[1] -= 2;
						break;
					case 2: // south
						playerpos[0] -= 2;
						break;
					case 3: // west
						playerpos[1] += 2;
						break;
				}
				break;
		}
		launch = null;
	}
	else {
		switch (direction) {
			case 0: // north
				playerpos[0]--;
				break;
			case 1: // east
				playerpos[1]++;
				break;
			case 2: // south
				playerpos[0]++;
				break;
			case 3: // west
				playerpos[1]--;
				break;
		}
	}

	if ( playerpos[0] < 0 || playerpos[0] >= tileGrid.length || playerpos[1] < 0 || playerpos[1] >= tileGrid[0].length ) {
		// Out of bounds
		loadLevel( level );
		return;
	}
	
	switch ( tileGrid[playerpos[0]][playerpos[1]] ) {
		case 2: // goal
			level += 2;
			loadLevel( level );
			return;
		case 3: // rotate north
			direction = 0;
			break;
		case 4: // rotate south
			direction = 2;
			break;
		case 5: // rotate east
			direction = 1;
			break;
		case 6: // rotate west
			direction = 3;
			break;
		case 7: // rotate right
			direction = (direction + 1) % 4;
			break;
		case 8: // rotate left
			direction = (direction + 3) % 4;
			break;
		case 9: // death
		case 16: // wall
			loadLevel( level );
			return;
		case 10: // launch north
			launch = 0;
			break;
		case 11: // launch south
			launch = 2;
			break;
		case 12: // launch east
			launch = 1;
			break;
		case 13: // launch west
			launch = 3;
			break;
		case 14: // launch forward
			launch = 4;
			break;
		case 15: // launch backward
			launch = 5;
			break;
	}
	
	tileGrid[playerpos[0]][playerpos[1]] = 1;
}

function render() {
	// Renders the tile grid to the PS grid
	for ( let y = 0; y < tileGrid.length; y++ ) {
		for ( let x = 0; x < tileGrid[y].length; x++ ) {
			switch ( tileGrid[y][x] ) {
				case 0: // empty
					PS.color( x, y, 150, 150, 150 );
					PS.glyph( x, y, " " );
					break;
				case 1: // player
					PS.color( x, y, PS.COLOR_BLUE );
					switch ( direction ) {
						case 0:
							PS.glyph( x, y, "↑" );
							break;
						case 1:
							PS.glyph( x, y, "→" );
							break;
						case 2:
							PS.glyph( x, y, "↓" );
							break;
						case 3:
							PS.glyph( x, y, "←" );
							break;
						default:
							PS.glyph( x, y, direction );
							break;
					}
					break;
				case 2: // goal
					PS.color( x, y, PS.COLOR_GREEN );
					PS.glyph( x, y, "⚑" );
					break;
				case 3: // rotate north
					PS.color( x, y, 150, 150, 100 );
					PS.glyph( x, y, "↑" );
					break;
				case 4: // rotate south
					PS.color( x, y, 150, 150, 100 );
					PS.glyph( x, y, "↓" );
					break;
				case 5: // rotate east
					PS.color( x, y, 150, 150, 100 );
					PS.glyph( x, y, "→" );
					break;
				case 6: // rotate west
					PS.color( x, y, 150, 150, 100 );
					PS.glyph( x, y, "←" );
					break;
				case 7: // rotate right
					PS.color( x, y, 50, 150, 150 );
					PS.glyph( x, y, "⭮" );
					break;
				case 8: // rotate left
					PS.color( x, y, 50, 150, 150 );
					PS.glyph( x, y, "⭯" );
					break;
				case 9: // death
					PS.color( x, y, PS.COLOR_RED );
					PS.glyph( x, y, "X" );
					break;
				case 10: // launch north
					PS.color( x, y, 200, 100, 200 );
					PS.glyph( x, y, "⭱" );
					break;
				case 11: // launch south
					PS.color( x, y, 200, 100, 200 );
					PS.glyph( x, y, "⭳" );
					break;
				case 12: // launch east
					PS.color( x, y, 200, 100, 200 );
					PS.glyph( x, y, "⭲" );
					break;
				case 13: // launch west
					PS.color( x, y, 200, 100, 200 );
					PS.glyph( x, y, "⭰" );
					break;
				case 14: // launch forward
					PS.color( x, y, 200, 50, 100 );
					PS.glyph( x, y, "‼" );
					break;
				case 15: // launch backward
					PS.color( x, y, 200, 50, 100 );
					PS.glyph( x, y, "⇓" );
					break;
				case 16: // wall
					PS.color( x, y, 100, 100, 100 );
					PS.glyph( x, y, "X" );
					break;
				default:
					PS.color( x, y, 170, 140, 0 );
					PS.glyph( x, y, " " );
					break;
			}
		}
	}
}

function statusUpdate() {
	switch (level) {
		case 0:
			PS.statusText( "Space to begin" );
			break;
		case 2:
			PS.statusText( "Arrow Keys swap tiles" );
			break;
		case 4:
			PS.statusText( "Mouse1 rotates or flips tiles" );
			break;
		default:
			PS.statusText(" ");
			break;
	}
}

function loadLevel( newlevel ) {
	if ( newlevel >= MAX_LEVEL ) {
		PS.timerStop( gameTimer );

		PS.statusText( "Congratulations! You've completed all levels!" );

		for ( let y = 0; y < tileGrid.length; y++ ) {
			for ( let x = 0; x < tileGrid[y].length; x++ ) {
				PS.color( x, y, 50, 50, 50 );
			}
		}

		tileGrid = [[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,],
					[-1, -1, -1, -1, -1, -1, -1, -1,] ];
		PS.gridSize( tileGrid[0].length, tileGrid.length );
		render();

		
		PS.timerStart( 30, function() {
			for ( let y = 1; y < tileGrid.length - 1; y++ ) {
				for ( let x = 1; x < tileGrid[y].length - 1; x++ ) {
					if (Math.random() < 0.2) {
						PS.glyph( x, y, "★" );
						PS.glyphColor( x, y, PS.COLOR_YELLOW );
					} else PS.glyph( x, y, " " );
			}
		}
		} );
		

		return;
	}

	// PS.debug( "Loading level " + newlevel + "\n" );
	
	//duplicate level data array into tileGrid
	tileGrid = structuredClone(levels[newlevel])
	PS.gridSize( tileGrid[0].length, tileGrid.length );
	direction = levels[newlevel + 1];
	pause = true;
	render();
	statusUpdate();
}