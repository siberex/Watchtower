/**
 * UI for A* search algorithm.
 * © Stepan Legachev, www.sib.li
 *
 */

$(document).ready(function() {

	var canvas = $("#maze"),
		ctx;
	var w, h,
		boardW, boardH;

	try {
		w = canvas.width();
		h = canvas.height();

		canvas[0].setAttribute("width", w);
		canvas[0].setAttribute("height", h);

		ctx = canvas[0].getContext("2d");
	} catch (e) {
		throw(e); // No sence in this :-)
	}

	Painter.width = w;
	Painter.height = h;
	Painter.ctx = ctx;

	// Maze size without frame thickness.
	Maze.width = parseInt( (w - Painter.frameGap * 2) / Painter.blockSize );
	Maze.height = parseInt( (h - Painter.frameGap * 2) / Painter.blockSize );

	Maze.walls = [];
	for (var i = 0; i < Maze.width; i++) {
		Maze.walls[i] = [];
		for (var j = 0; j < Maze.height; j++) Maze.walls[i][j] = 0;
	}

	// Fill canvas and draw frame.
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, w, h);

	//Painter.drawFrame(Maze.width, Maze.height);
	Painter.clearField(Maze.width, Maze.height);

	// Attaching events.
	$(window).bind("keydown", function(event) {
		Painter.keyDown(event);

	});

	canvas.bind("mousedown", Painter.mouseDown);
	canvas.bind("mousemove", Painter.mouseMove);
	canvas.bind("mouseup", Painter.mouseUp);
	canvas.bind("mouseout", Painter.mouseOut);

	$(window).bind("mouseup", function(event) {
		if (Painter.drawing) {
			Painter.drawing = false;
			Painter.redrawPath();
			Painter.drawBlinky(Maze.blinky);
			Painter.drawPacman(Maze.pacman);
			//Painter.repaintWalls();

		}

	});

});


var Painter = {
	// Block size in pixels.
	blockSize: 16,

	// Frame thickness in pixels.
	frameGap: 8,

	// Paint mode: "wall", "blinky" or "pacman".
	mode: "wall",

	// Ширина и высота поля.
	width: false,
	height: false,
	ctx: false,

	// Last finded path.
	lastPath: false,

	// Paths to heroes images. “?” will be replaced later to “left”, “right”, “up” or “down”.
	blinkyImg: {
		up:    "img/blinky-up.png",
		right: "img/blinky-right.png",
		down:  "img/blinky-down.png",
		left:  "img/blinky-left.png"
	},
	pacmanImg: {
		up:    "img/pacman-up.png",
		right: "img/pacman-right.png",
		down:  "img/pacman-down.png",
		left:  "img/pacman-left.png"
	},

	blinkyDir: "left",
	pacmanDir: "left",

	wallDrawed: false,
	drawing: false,

	mouseDown: function(event) {
		var x = event.pageX - this.offsetLeft;
		var y = event.pageY - this.offsetTop;

		if ( Painter.isOutOfMaze(x, y) ) return false;
		var mazeXY = Painter.getMazeCoords(x, y);

		if (Painter.mode == "wall") {
			/** DEBUG { */
			if (event.ctrlKey) {
				var N = Maze.getWallsAround(mazeXY[0], mazeXY[1]);
				//console.clear();
				console.log(N);
				return;
			}
			/** } DEBUG **/

			Painter.drawing = Maze.isWallHere(mazeXY[0], mazeXY[1]) ? -1 : 1;
			Painter.wallDrawed = [];
			for (var i = 0; i < Maze.width; i++) {
				Painter.wallDrawed[i] = [];
				for (var j = 0; j < Maze.height; j++) Painter.wallDrawed[i][j] = false;
			}
			Painter.drawMaze(mazeXY);
		}
		if (Painter.mode == "pacman") Painter.drawPacman(mazeXY);
		if (Painter.mode == "blinky") Painter.drawBlinky(mazeXY);

		// console.debug(mazeXY);
	},
	mouseMove: function(event) {
		if (Painter.mode == "wall" && Painter.drawing != false) {
			var x = event.pageX - this.offsetLeft;
			var y = event.pageY - this.offsetTop;
			if ( Painter.isOutOfMaze(x, y) ) return false;

			Painter.drawMaze( Painter.getMazeCoords(x, y) );
		}
	},
	mouseUp: function(event) {},
	mouseOut: function(event) {},

	keyDown: function(event) {
		if (Painter.mode == "pacman" || Painter.mode == "blinky") {
			if (!Maze[Painter.mode]) return false;
			// Персонаж может «съесть» другого персонажа, но это на самом деле баг :-)

			var directions = {38: "up", 39: "right", 40: "down", 37: "left"};

			var mazeX = Maze[Painter.mode][0];
			var mazeY = Maze[Painter.mode][1];

			var k = event.which;
			if (k == 38) mazeY--;
			if (k == 39) mazeX++;
			if (k == 40) mazeY++;
			if (k == 37) mazeX--;

			Painter.drawHero(Painter.mode, [mazeX, mazeY], directions[k]);
		}
	},


	clearPath: function(path) {
		var path = path || Painter.lastPath;
		if (!path) return;
		for (var i = 0; i < path.length - 1; i++) {
			if ( !Maze.isWallHere(path[i].x, path[i].y) )
				Painter.clearZone([path[i].x, path[i].y]);
		}
    // TODO: clear steps count
	},

	drawPath: function(path) {
		var ctx = Painter.ctx;
		if (!ctx) return false;

		if (!Maze.blinky || !Maze.pacman) return false;

		var x, y;

		Painter.lastPath = path;

		var directions = {  //  A-B
			"0,-1": "up",     //  1
			"1,0":  "right",  //  1
			"0,1":  "down",   //  -1
			"-1,0": "left"    //  -1
		};
		for (var i = 0; i < path.length - 1; i++) {

			if ( i == 0 ) {
				// Blinky should look in direction to path to Pacman.
				Painter.blinkyDir =
					directions[ [path[i].x - Maze.blinky[0],
								 path[i].y - Maze.blinky[1]].toString() ];
			}
			if ( i == path.length - 2 ) { // -2 because last step will be Pacman itself.
				// Pacman should be directed to path to Blinky.
				Painter.pacmanDir =
					directions[ [path[i].x - Maze.pacman[0],
								 path[i].y - Maze.pacman[1]].toString() ];
				//console.debug(Painter.pacmanDir);
			}
			if ( !Maze.isWallHere(path[i].x, path[i].y) ) {
				x = path[i].x * Painter.blockSize + Painter.frameGap;
				y = path[i].y * Painter.blockSize + Painter.frameGap;

				ctx.fillStyle = "rgb(255, 184, 151)";
				ctx.fillRect(x + Painter.blockSize / 2 - 1, y + Painter.blockSize / 2 - 1, 2, 2);
			}
		}
	},

	redrawPath: function() {
		Painter.clearPath();
		var path = Maze.findPath();
		if (!path) return false;
		Painter.drawPath(path);
    // TODO: update steps count
	},


	drawMaze: function(mazeXY) {
		// Wall should not be drawn upon characters.
		if ( Maze.blinky.toString() == mazeXY.toString() ) return false;
		if ( Maze.pacman.toString() == mazeXY.toString() ) return false;

		if ( !Painter.wallDrawed[ mazeXY[0] ][ mazeXY[1] ] ) {

			var ctx = Painter.ctx;
			if (!ctx) return false;

			var x = mazeXY[0] * Painter.blockSize + Painter.frameGap;
			var y = mazeXY[1] * Painter.blockSize + Painter.frameGap;

			if ( Painter.drawing == -1 ) {
				Maze.walls[ mazeXY[0] ][ mazeXY[1] ] = 0;
				//Painter.clearZone(mazeXY);
			} else if ( Painter.drawing == 1 ) {
				Maze.walls[ mazeXY[0] ][ mazeXY[1] ] = 1;
				//Painter.clearZone(mazeXY);
				//ctx.fillStyle = "rgb(33, 33, 222)";
				//ctx.fillRect(x, y, Painter.blockSize - 1, Painter.blockSize - 1);
			}

            // Достаточно узкое место, медленные бразуеры из-за ожидания отрисовки
            // могут замедлять обработку движения мыши, отрисовку есть смысл
            // выносить в отдельный поток.
            for (var i = mazeXY[0] - 1; i <= mazeXY[0] + 1; i++) {
                for (var j = mazeXY[1] - 1; j <= mazeXY[1] + 1; j++) {
                    // Небольшой костыль чтобы во время рисования не исчезали персонажи.
                    if ( (Maze.blinky[0] === i && Maze.blinky[1] === j)
                        || (Maze.pacman[0] === i && Maze.pacman[1] === j) ) continue;

                    Painter.clearZone([i, j]);
                    if ( Maze.isWallHere(i, j) ) {
                        var N = Maze.getWallsAround(i, j);
                        if (Walls[N]) {
                            x = i * Painter.blockSize + Painter.frameGap;
                            y = j * Painter.blockSize + Painter.frameGap;
                            Painter.ctx.drawImage(Walls[N], x, y);
                        }
                    }
                }
            }

		}
		Painter.wallDrawed[ mazeXY[0] ][ mazeXY[1] ] = true;
	},

	repaintWalls: function() {
		for (var i = -1; i <= Maze.width; i++) {
			for (var j = -1; j <= Maze.height; j++) {
				if ( Maze.isWallHere(i, j) ) {
					var N = Maze.getWallsAround(i, j);
					if (Walls[N]) {
						Painter.clearZone([i, j]);
						x = i * Painter.blockSize + Painter.frameGap;
						y = j * Painter.blockSize + Painter.frameGap;
						Painter.ctx.drawImage(Walls[N], x, y);
					}
				}
			}
		}
	},

	drawHero: function(name, mazeXY, direction) {
		var opposite = {pacman: 'blinky', blinky: 'pacman'};
		if (!opposite[name]) return false;

		var ctx = Painter.ctx;
		if (!ctx) return false;

		if (!Maze) return false;
		if (!mazeXY) return false;

		// Если персонаж сдвинулся.
		if ( Maze[name].toString() != mazeXY.toString() ) {

			// На стене персонажа не рисуем.
			if ( Maze.isWallHere(mazeXY[0], mazeXY[1]) ) return false;

			// Стираем ранее нарисованного персонажа.
			if (Maze[name]) Painter.clearZone(Maze[name]);

			Maze[name] = mazeXY;

			// Съедаем другого персонажа, если встали на его клетку.
			if ( Maze[ opposite[name] ].toString() == mazeXY.toString() ) {
				Painter.clearZone(Maze[ opposite[name] ]);
				Maze[ opposite[name] ] = false;
			}

			Painter.redrawPath();
			if (Maze[ opposite[name] ]) Painter.drawHero(opposite[name], Maze[ opposite[name] ]);
		}

		// Очищаем поле перед рисованием — направление взгляда персонажа могло измениться.
		Painter.clearZone(mazeXY);

		var direction = direction || Painter[name + "Dir"];
		// Здесь можно проверить direction на соответствие значению.

		var x = Maze[name][0] * Painter.blockSize + Painter.frameGap;
		var y = Maze[name][1] * Painter.blockSize + Painter.frameGap;

		ctx.drawImage(Painter[name + "Img"][direction], x, y);
	},

	drawBlinky: function(mazeXY) {
		return Painter.drawHero("blinky", mazeXY);
	},

	drawPacman: function(mazeXY) {
		return Painter.drawHero("pacman", mazeXY);
	},


	/**
	 * Очистка одного блока лабиринрта на поле.
	 */
	clearZone: function(mazeXY) {
		var ctx = Painter.ctx;
		if (!ctx) return false;
		if (!mazeXY) return false;

		var x = mazeXY[0] * Painter.blockSize + Painter.frameGap;
		var y = mazeXY[1] * Painter.blockSize + Painter.frameGap;

		ctx.fillStyle = "rgb(0, 0, 0)";
		//console.debug(x, y, Painter.blockSize, Painter.blockSize);
		ctx.fillRect(x, y, Painter.blockSize, Painter.blockSize);

		// Перерисовывем рамку если залезли на углы.
        // Это костыль, убираем.
		/*if (
			( mazeXY[0] == 0 && (mazeXY[1] == 0 || mazeXY[1] == Maze.height-1) ) ||
			( mazeXY[0] == Maze.width-1 && (mazeXY[1] == 0 || mazeXY[1] == Maze.height-1) )
		) {
			Painter.drawFrame(Maze.width, Maze.height);
		}*/
	},



	/**
	 * Преобразует пиксельные координаты на поле в координаты лабиринта.
	 */
	getMazeCoords: function(x, y) {
		var mazeX = parseInt( (x - Painter.frameGap - 1) / Painter.blockSize );
		var mazeY = parseInt( (y - Painter.frameGap - 1) / Painter.blockSize );
		//console.debug(mazeX, mazeY, "———", x, y);
		return [mazeX, mazeY];
	},

	/**
	 * Проверяет, находятся ли координаты за пределами поля.
	 */
	isOutOfMaze: function(x, y) {
		var result = 0;
		// Мышь на левой рамке.
		if (x < Painter.frameGap) result |= 1;
		// Мышь на верхней рамке.
		if (y < Painter.frameGap) result |= 2;
		// Мышь на правой рамке.
		if (x > (Painter.width - Painter.frameGap -
			     (Painter.width - Painter.frameGap * 2) % Painter.blockSize ) )
			result |= 4;
		// Мышь на нижней рамке.
		if (y > (Painter.height - Painter.frameGap -
				 (Painter.height - Painter.frameGap * 2) % Painter.blockSize ) )
			result |= 8;
		return result;
	},


	/**
	 * Рисует рамку вокруг поля.
	 * DEPRECATED
     *
	drawFrame: function(mazeWidth, mazeHeight) {
		var ctx = Painter.ctx;
		//ctx.fillStyle = "none";

		// Костыль.
		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgb(0, 0, 0)";
		// Отнимаем 0.5 для чёткой отрисовки линии (линия толщиной 1 пиксель должна проходить по середине пикселя).
		Painter.roundedRect(Painter.frameGap - 1.5, Painter.frameGap - 1.5,
							mazeWidth * Painter.blockSize + 3, mazeHeight * Painter.blockSize + 3,
							3);
		ctx.stroke();

		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgb(33, 33, 222)";
		// Отнимаем 0.5 для чёткой отрисовки линии (линия толщиной 1 пиксель должна проходить по середине пикселя).
		Painter.roundedRect(Painter.frameGap - 1.5, Painter.frameGap - 1.5,
							mazeWidth * Painter.blockSize + 3, mazeHeight * Painter.blockSize + 3,
							3);
		ctx.stroke();
	}, */


    clearField: function(mazeWidth, mazeHeight) {
		var ctx = Painter.ctx;

	    //ctx.fillStyle = "rgb(0, 0, 0)";

	    ctx.fillStyle = "rgba(33, 33, 222, 0.2)";
	    ctx.fillRect(0, 0, Painter.width, Painter.height);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgb(33, 33, 222)";
		// Отнимаем 0.5 для чёткой отрисовки линии (линия толщиной 1 пиксель должна проходить по середине пикселя).
		Painter.roundedRect(Painter.frameGap - 1.5, Painter.frameGap - 1.5,
							mazeWidth * Painter.blockSize + 3, mazeHeight * Painter.blockSize + 3,
							3);
        ctx.fillStyle = "rgb(0, 0, 0)";
	    ctx.fill();
		ctx.stroke();
	},


	/**
	 * Рисует прямоугольник со скруглёнными уголками.
	 */
	roundedRect: function(x, y, width, height, radius, ctx) {
		var ctx = ctx || Painter.ctx;

		ctx.beginPath();

		// Левый верхний угол.
		ctx.moveTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);

		// Правый верхний угол.
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

		// Правый нижний угол.
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

		// Левый нижний угол.
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

		ctx.closePath();
	}
}

// Redefine image srcs for data:url use.
Painter.blinkyImg = {
	up:    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX////e3t4hIf//AACc7mbrAAAAAXRSTlMAQObYZgAAAENJREFUeF51zK" +
		   "ENwCAURdFXD2EVBngJ3QLJCmyFZJqaTvENhvwECGiuOPLi5GRRO/CU/4WNXz641ARhDL1DDYQnzR5Nn+ofzQ7OUvMAAAAASUVORK5CYII=",
	right: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX////e3t4hIf//AACc7mbrAAAAAXRSTlMAQObYZgAAAEtJREFUeF5dxD" +
		   "ENgEAMhtEvYSWpFQQ0qQUWllOBAMQgABG4OBss3Xr5Gdh4w+NjDyDBJN1YHzu25Yq1PImWF9HHQUj1zyucxX0G4AXI4h/NIWSKqgAAAABJRU5ErkJggg==",
	down:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX////e3t4hIf//AACc7mbrAAAAAXRSTlMAQObYZgAAAE9JREFUeF5NxL" +
		   "ENhDAQRcEnXQraVihgrS3DIS1QgPu5kBZowglVbEKCLH0CEiYYXpaABD/pwKTE1iuZa98otTfK/2zEfg9C+uYjnMV9AuAB264fzaaekHgAAAAASUVORK5CYII=",
	left:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX////e3t4hIf//AACc7mbrAAAAAXRSTlMAQObYZgAAAEdJREFUeF5lxL" +
		   "EJgEAMhtEPxEYUV7GWyE1hnVFumtvDLbJGBgj8Fpa+4vHZE5Bgkh62Hsnsd7L4SE4fxdWjaNIvq2YcZisAL8XWH82QyxvdAAAAAElFTkSuQmCC"
};
Painter.pacmanImg = {
	up:    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX//////wB4fhrhAAAAAXRSTlMAQObYZgAAADNJREFUeF4lwqENACAMAM" +
		   "F3rIBjBWQFCWshGliNkZCICtJyOb5cEaENVJnmV+zXl0PahAcTfAyTfR3ZTgAAAABJRU5ErkJggg==",
	right: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX//////wB4fhrhAAAAAXRSTlMAQObYZgAAADFJREFUeF4lirENACAMwy" +
		   "xxACdwSl7nFE7IyNCBtlhRBicA4zAvKyoy2ohuf5lrfZoHQ30M3L6V5ZEAAAAASUVORK5CYII=",
	down:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX//////wB4fhrhAAAAAXRSTlMAQObYZgAAADBJREFUeF4lwrEJACAMAM" +
		   "EHW8HWIugiEjdzVsewkCCJx/GlTTn066fF5VVpAxFyJTwCyQlH/zXpTAAAAABJRU5ErkJggg==",
	left:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX//////wB4fhrhAAAAAXRSTlMAQObYZgAAAC9JREFUeF4lirEJACAQAw" +
		   "8sLB3hR3F1R/rSIoUchiMcIQDzUM2+ssII2Pofq/0YHlWDDZmstu2HAAAAAElFTkSuQmCC"
};

jQuery.each(Painter.blinkyImg, function(direction, src) {
	var img = new Image();
	img.src = src;
	Painter.blinkyImg[direction] = img;
});
jQuery.each(Painter.pacmanImg, function(direction, src) {
	var img = new Image();
	img.src = src;
	Painter.pacmanImg[direction] = img;
});