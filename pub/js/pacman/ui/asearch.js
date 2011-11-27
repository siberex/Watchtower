var Maze = {
	// Maze dimensions in blocks.
	width: false,
	height: false,

	// Blinky and Pacman coordinates.
	blinky: false,
	pacman: false,

	// Walls
	walls: false,

	findPath: function() {
		if (!Maze.walls) return false;
		if (!Maze.blinky || !Maze.pacman) return false;

		var graph = new Graph( Maze.walls );
		var start = graph.nodes[ Maze.blinky[0] ][ Maze.blinky[1] ];
		var end = graph.nodes[ Maze.pacman[0] ][ Maze.pacman[1] ];

		var result = astar.search(graph.nodes, start, end);
		//console.debug(result);
		return result;
	},

	getWallsAround: function(x, y) {
		if (!Maze.walls) return false;

		var N = Maze.isWallHere(  x, y-1)
			  |	Maze.isWallHere(x+1, y-1) << 1
			  | Maze.isWallHere(x+1,   y) << 2
			  | Maze.isWallHere(x+1, y+1) << 3
			  | Maze.isWallHere(  x, y+1) << 4
			  | Maze.isWallHere(x-1, y+1) << 5
			  | Maze.isWallHere(x-1,   y) << 6
			  | Maze.isWallHere(x-1, y-1) << 7;

		return N;
	},

	printWalls: function() {
		var result = "";
		for (var j = 0; j < Maze.height; j++) {
			result += "\n";
			for (var i = 0; i < Maze.walls.length; i++) {
				result += (Maze.walls[i][j]) ? "W" : "_";
			}
		}
		return result;
	},

	isWallHere: function(mazeX, mazeY) {
		if (mazeX < 0 || mazeX > Maze.width-1) return 1;
		if (mazeY < 0 || mazeY > Maze.height-1) return 1;
		return parseInt(Maze.walls && Maze.walls[mazeX] && Maze.walls[mazeX][mazeY]);
	}

}
