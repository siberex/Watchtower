/**
 * graph.js http://github.com/bgrins/javascript-astar
 *
 * Creates a Graph class used in the astar search algorithm.
 */

var GraphNodeType = { OPEN: 0, WALL: 1 };
function Graph(grid) {
	this.elements = grid;
	this.nodes = [];

	for (var x = 0, len = grid.length; x < len; ++x) {
		var row = grid[x];
		this.nodes[x] = [];
		for (var y = 0, l = row.length; y < l; ++y) {
			this.nodes[x].push( new GraphNode(x, y, row[y]) );
		}
	}
}
Graph.prototype.toString = function() {
	var graphString = "\n";
	var nodes = this.nodes;
	for (var x = 0, len = nodes.length; x < len; ++x) {
		var rowDebug = "";
		var row = nodes[x];
		for (var y = 0, l = row.length; y < l; ++y) {
			rowDebug += row[y].type + " ";
		}
		graphString = graphString + rowDebug + "\n";
	}
	return graphString;
};

function GraphNode(x,y,type) {
	this.data = { };
	this.x = x;
	this.y = y;
	this.pos = {x:x, y:y};
	this.type = type;
}
GraphNode.prototype.toString = function() {
	return "[" + this.x + " " + this.y + "]";
};
GraphNode.prototype.isWall = function() {
	return this.type == GraphNodeType.WALL;
};

