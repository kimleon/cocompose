document.addEventListener('DOMContentLoaded', function () {

	var CELL_SIZE_X = 25;
	var CELL_SIZE_Y = 10;
	var PIANO_HEIGHT = 6;

	var canvas = document.getElementById('piano');
	canvas.style.border = "black 1px solid";
	var ctx = canvas.getContext('2d');

	var controller = Controller();

	// Clears the Sheet and polls the controller to redraw it.
	var redrawSheet = function () {
		var colors = {0:"white", 1:"black", 2:"white", 3:"black", 4:"white", 5:"white", 6:"black", 7:"white", 8:"black", 9:"white", 10:"black", 11:"white"}
		var drawCell = function (coordX,coordY) {
			ctx.fillStyle = colors[coordX%12];
			ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
		};

		ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
		ctx.canvas.width = CELL_SIZE_X * controller.dimX;
		ctx.canvas.height = CELL_SIZE_Y * PIANO_HEIGHT;

		for (var i = controller.dimX - 1; i >= 0; i--) {
			for (var j = PIANO_HEIGHT - 1; j >= 0; j--) {
				drawCell(i,j);
			};
		};
	};

	//Whenever the Sheet gets updated in the controller/model, redraw it
	controller.addSubscriber(redrawSheet);

	redrawSheet();

});