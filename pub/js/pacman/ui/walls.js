
var Walls = [];



//(function() {

Walls.set = function(sprite, arrWalls) {
	for (var i = 0; i < arrWalls.length; i++) {
		Walls[ parseInt(arrWalls[i]) ] = sprite;
	}
}

var block = (Painter && Painter.blockSize) ? Painter.blockSize : 16;

var newSprite = function() {
	var canvas = document.createElement('canvas');
	var block = (Painter && Painter.blockSize) ? Painter.blockSize : 16;
	canvas.width = canvas.height = block;
	var ctx = canvas.getContext('2d');
	canvas.ctx = ctx;
	return canvas;
}

var rotate = function(src) {
	if (!src.ctx) src.ctx = src.getContext('2d');
	var canvas = newSprite();
	var block = canvas.getAttribute("width");
	canvas.ctx.save();
	canvas.ctx.translate(block/2, block/2);
	canvas.ctx.rotate(Math.PI/2);
	canvas.ctx.drawImage(src, -block/2, -block/2);
	canvas.ctx.restore();
	return canvas;
}

var rect = function(x, y, width, height, ctx, fill) {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgb(33, 33, 222)";
	ctx.fillStyle = fill || "rgba(33, 33, 222, 0.2)";
	ctx.rect(x, y, width, height);
	ctx.fill();
	ctx.stroke();
}

var roundRect = function(x, y, width, height, radius, ctx, fill) {
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgb(33, 33, 222)";
	ctx.fillStyle = fill || "rgba(33, 33, 222, 0.2)";
	Painter.roundedRect(x, y, width, height, radius, ctx);
	ctx.fill();
	ctx.stroke();
}



/**
 * Прямой перебор двоичных значений.
 * Во входном массиве вместо перебираемых значений -1, например:
 * enumerator([0, -1, 1]) → [[0, 0, 1], [0, 1, 1]]
 */
var enumerator = function(arr) {
	var results = [];
	var head = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === 0 || arr[i] === 1) {
			head.push( arr[i] );
		} else if (arr[i] === -1) {
			var tails = enumerator( arr.slice(i+1) );
			for (var j = 0; j < tails.length; j++) {
				results.push( head.concat([0]).concat(tails[j]) );
				results.push( head.concat([1]).concat(tails[j]) );
			}
			break;
		}
	}
	return (results.length > 0) ? results : [head];
}

// Some hard and stupid work to gain high perfomance on rendering.
//
// "?X?" +
// "_+_" +
// "?_X" → [1, -1, 0, 1, 0, -1, 0, -1] → enumerator() for it → results to numbers.
var getVariations = function(wallsConf, rotate) {
	if (typeof wallsConf !== "string") return false;
	wallsConf = wallsConf.replace(/[^X_?]/gm, '');
	if (wallsConf.length !== 8) return false;
	wallsConf = wallsConf.split('');
	var map = {'X': 1, '_': 0, '?': -1};
	wallsConf = [
		map[ wallsConf[1] ],
		map[ wallsConf[2] ],
		map[ wallsConf[5-1] ],
		map[ wallsConf[8-1] ],
		map[ wallsConf[7-1] ],
		map[ wallsConf[6-1] ],
		map[ wallsConf[3] ],
		map[ wallsConf[0] ]
	];
	while (rotate) {
		// 701   567
		// 6+2 → 4+0
		// 543   321
		wallsConf = [
			wallsConf[6],
			wallsConf[7],
			wallsConf[0],
			wallsConf[1],
			wallsConf[2],
			wallsConf[3],
			wallsConf[4],
			wallsConf[5]
		]
		rotate--;
	}
	var variations = enumerator(wallsConf);
	for (var i = 0; i < variations.length; i++) {
		//variations[i] = variations[i].toString(); continue;
		variations[i] = variations[i][0]
					  | variations[i][1] << 1
					  | variations[i][2] << 2
					  | variations[i][3] << 3
					  | variations[i][4] << 4
					  | variations[i][5] << 5
					  | variations[i][6] << 6
					  | variations[i][7] << 7;
	}
	return variations;
}

var getWallByVariation = function(variation) {
	var wall = "\n" + ( (variation >> 7 & 1) ? 'X' : '_' )
			 + ( (variation & 1) ? 'X' : '_' )
			 + ( (variation >> 1 & 1) ? 'X' : '_' )
			 + "\n"
			 + ( (variation >> 6 & 1) ? 'X' : '_' )
			 + "+"
			 + ( (variation >> 2 & 1) ? 'X' : '_' )
			 + "\n"
			 + ( (variation >> 5 & 1) ? 'X' : '_' )
			 + ( (variation >> 4 & 1) ? 'X' : '_' )
			 + ( (variation >> 3 & 1) ? 'X' : '_' );
	return wall;
}

var w = Walls;


var sprite0 = newSprite();
roundRect(1.5, 1.5, 13, 13, 3, sprite0.ctx);
w.set(sprite0, getVariations(
  '?_?' +
  '_+_' +
  '?_?'
));


var sprite1str =  '?X?' +
				  '_+_' +
				  '?_?';
var sprite1 = newSprite();
roundRect(1.5, 1.5 - block, 13, 13 + block, 3, sprite1.ctx);
w.set(sprite1, getVariations(sprite1str));
// + 3 rotations:
w.set( sprite1 = rotate(sprite1), getVariations(sprite1str, 1) );
w.set( sprite1 = rotate(sprite1), getVariations(sprite1str, 2) );
w.set( sprite1 = rotate(sprite1), getVariations(sprite1str, 3) );


var sprite2str =  '?XX' +
				  '_+X' +
				  '?_?';
var sprite2 = newSprite();
roundRect(1.5, 1.5 - block, 13 + block, 13 + block, 3, sprite2.ctx);
w.set(sprite2, getVariations(sprite2str));
// + 3 rotations:
w.set( sprite2 = rotate(sprite2), getVariations(sprite2str, 1) );
w.set( sprite2 = rotate(sprite2), getVariations(sprite2str, 2) );
w.set( sprite2 = rotate(sprite2), getVariations(sprite2str, 3) );


var sprite3str =  '?X_' +
				  '_+X' +
				  '?_?';
var sprite3 = newSprite();
roundRect(1.5, 1.5 - block, 13 + block, 13 + block, 3, sprite3.ctx);
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite3.ctx, "black"); 
w.set(sprite3, getVariations(sprite3str));
// + 3 rotations:
w.set( sprite3 = rotate(sprite3), getVariations(sprite3str, 1) );
w.set( sprite3 = rotate(sprite3), getVariations(sprite3str, 2) );
w.set( sprite3 = rotate(sprite3), getVariations(sprite3str, 3) );


var sprite4str =  '?X?' +
				  '_+_' +
				  '?X?';
var sprite4 = newSprite();
rect(1.5, -1.5, 13, 13 + block, sprite4.ctx);
w.set(sprite4, getVariations(sprite4str));
// + rotation:
w.set( rotate(sprite4), getVariations(sprite4str, 1) );


var sprite5str =  'XXX' +
				  'X+X' +
				  '?_?';
var sprite5 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block, sprite5.ctx);
w.set(sprite5, getVariations(sprite5str));
// + 3 rotations:
w.set( sprite5 = rotate(sprite5), getVariations(sprite5str, 1) );
w.set( sprite5 = rotate(sprite5), getVariations(sprite5str, 2) );
w.set( sprite5 = rotate(sprite5), getVariations(sprite5str, 3) );


var sprite6str =  'XX_' +
				  'X+X' +
				  '?_?';
var sprite6 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block, sprite6.ctx);
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite6.ctx, "black");
w.set(sprite6, getVariations(sprite6str));
// + 3 rotations:
w.set( sprite6 = rotate(sprite6), getVariations(sprite6str, 1) );
w.set( sprite6 = rotate(sprite6), getVariations(sprite6str, 2) );
w.set( sprite6 = rotate(sprite6), getVariations(sprite6str, 3) );


var sprite7str =  '_XX' +
				  'X+X' +
				  '?_?';
var sprite7 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block, sprite7.ctx);
roundRect(1.5 - block, 1.5 - block, block, block, 3, sprite7.ctx, "black");
w.set(sprite7, getVariations(sprite7str));
// + 3 rotations:
w.set( sprite7 = rotate(sprite7), getVariations(sprite7str, 1) );
w.set( sprite7 = rotate(sprite7), getVariations(sprite7str, 2) );
w.set( sprite7 = rotate(sprite7), getVariations(sprite7str, 3) );


var sprite8str =  '_X_' +
				  'X+X' +
				  '?_?';
var sprite8 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block, sprite8.ctx);
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite8.ctx, "black");
roundRect(1.5 - block, 1.5 - block, block, block, 3, sprite8.ctx, "black");
w.set(sprite8, getVariations(sprite8str));
// + 3 rotations:
w.set( sprite8 = rotate(sprite8), getVariations(sprite8str, 1) );
w.set( sprite8 = rotate(sprite8), getVariations(sprite8str, 2) );
w.set( sprite8 = rotate(sprite8), getVariations(sprite8str, 3) );


var sprite9str = '_X_' +
                 'X+X' +
                 '_XX';
var sprite9 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block + 1.5 + 1.5, sprite9.ctx);
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite9.ctx, "black");
roundRect(1.5 - block, 1.5 - block, block, block, 3, sprite9.ctx, "black");
roundRect(1.5 - block, -1.5 + block, block, block, 3, sprite9.ctx, "black");
w.set(sprite9, getVariations(sprite9str));
// + 3 rotations:
w.set( sprite9 = rotate(sprite9), getVariations(sprite9str, 1) );
w.set( sprite9 = rotate(sprite9), getVariations(sprite9str, 2) );
w.set( sprite9 = rotate(sprite9), getVariations(sprite9str, 3) );


var sprite11str = '_X_' +
                  'X+X' +
                  'XXX';
var sprite11 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block + 1.5 + 1.5, sprite11.ctx);
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite11.ctx, "black");
roundRect(1.5 - block, 1.5 - block, block, block, 3, sprite11.ctx, "black");
w.set(sprite11, getVariations(sprite11str));
// + 3 rotations:
w.set( sprite11 = rotate(sprite11), getVariations(sprite11str, 1) );
w.set( sprite11 = rotate(sprite11), getVariations(sprite11str, 2) );
w.set( sprite11 = rotate(sprite11), getVariations(sprite11str, 3) );


var sprite12str = '_XX' +
				  'X+X' +
            	  'XXX';
var sprite12 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block + 1.5 + 1.5, sprite12.ctx);
roundRect(1.5 - block, 1.5 - block, block, block, 3, sprite12.ctx, "black");
w.set(sprite12, getVariations(sprite12str));
// + 3 rotations:
w.set( sprite12 = rotate(sprite12), getVariations(sprite12str, 1) );
w.set( sprite12 = rotate(sprite12), getVariations(sprite12str, 2) );
w.set( sprite12 = rotate(sprite12), getVariations(sprite12str, 3) );


var sprite13str = 'XX_' +
                  'X+X' +
                  '_XX';
var sprite13 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block + 1.5 + 1.5, sprite13.ctx);
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite13.ctx, "black");
roundRect(1.5 - block, -1.5 + block, block, block, 3, sprite13.ctx, "black");
w.set(sprite13, getVariations(sprite13str));
// + rotation
w.set( rotate(sprite13), getVariations(sprite13str, 1) );


var sprite14str = '_X_' +
                  'X+X' +
                  '_X_';
var sprite14 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block + 1.5 + 1.5, sprite14.ctx);
roundRect(1.5 - block, 1.5 - block, block, block, 3, sprite14.ctx, "black");
roundRect(-1.5 + block, 1.5 - block, block, block, 3, sprite14.ctx, "black");
roundRect(-1.5 + block, -1.5 + block, block, block, 3, sprite14.ctx, "black");
roundRect(1.5 - block, -1.5 + block, block, block, 3, sprite14.ctx, "black");
w.set(sprite14, getVariations(sprite14str));


var sprite15str = 'XXX' +
                  'X+X' +
                  'XXX';
var sprite15 = newSprite();
rect(-1.5, -1.5 , block + 1.5 + 1.5, block + 1.5 + 1.5, sprite15.ctx);
w.set(sprite15, getVariations(sprite15str));




/*
var block = 16;
...
var x = 1 * Painter.blockSize + Painter.frameGap;
var y = 1 * Painter.blockSize + Painter.frameGap;
Painter.ctx.drawImage(sprite2, x, y);


for (var i = 0, count = 0; i < Walls.length; i++) {
  if (typeof Walls[i] != 'undefined') count++;
  else console.debug( getWallByVariation(i) );
}
console.debug(count/256*100);


*/


//})();