
$(document).ready(function() {

	$( "#btn-wall" ).button({
		icons: {
			primary: "ui-icon-wall"
		}
	});

	$( "#btn-blinky" ).button({
		icons: {
			primary: "ui-icon-blinky"
		}
	});

	$( "#btn-pacman" ).button({
		icons: {
			primary: "ui-icon-pacman"
		}
	});


	$( "#drawpick" ).buttonset().change(function(event) {
		var elChecked = $("#drawpick input[name='drawmode']:checked");
		var mode = elChecked.val();
		if (mode != "wall" && mode != "blinky" && mode != "pacman") mode = "wall";
		Painter.mode = mode;
		// Специальный костыль.
		elChecked.blur();
	}).ready(function(event) {
		var mode = $("#drawpick input[name='drawmode']:checked").val();
		if (mode != "wall" && mode != "blinky" && mode != "pacman") mode = "wall";
		Painter.mode = mode;
	});


	/*$( "#btn-find" ).button({
		icons: {
			primary: "ui-icon-find"
		}
	}).click(function() {
		Painter.drawPath( Maze.findPath() );
	});*/

});