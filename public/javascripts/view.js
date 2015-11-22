document.addEventListener('DOMContentLoaded', function () {

	var CELL_SIZE_X = 25;
	var CELL_SIZE_Y = 10;

	var canvas = document.getElementById('sheet');
	canvas.style.border = "black 1px solid";
	var ctx = canvas.getContext('2d');

	var controller = Controller();

	// Clears the Sheet and polls the controller to redraw it.
	var redrawSheet = function () {

		var drawCell = function (coordX,coordY) {
			ctx.fillStyle = "black";
			ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
		};

		ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
		ctx.canvas.width = CELL_SIZE_X * controller.dimX;
		ctx.canvas.height = CELL_SIZE_Y * controller.dimY;

		var noteCells = controller.returnNoteCells();
		noteCells.map(function (coords) {
			drawCell(coords[0],coords[1]);
		});
	};

	isDown = false;
	mouseListener = function(evt){
		if (isDown) {
			var mouseCoordsToMouseCoords = function (mouseX,mouseY) {
				var canvasRect = canvas.getBoundingClientRect();

				xCoord = Math.floor((mouseX - canvasRect.left)/CELL_SIZE_X);
				yCoord = Math.floor((mouseY - canvasRect.top)/CELL_SIZE_Y);

				return [xCoord, yCoord];
			}

			cellCoords = mouseCoordsToMouseCoords(evt.clientX,evt.clientY);
			if (evt.button === 0){
				controller.setCell(cellCoords[0], cellCoords[1], true);
			} else if (evt.button === 2) {
				controller.setCell(cellCoords[0], cellCoords[1], false);
			};
		};
	};

	canvas.addEventListener("mousedown", function(evt){
		isDown = true;
		mouseListener(evt);
	});
	canvas.addEventListener("mouseup", function(evt){
		isDown = false;
	});

	// Listens for mouseclick to notify controller
	canvas.addEventListener("mousemove", mouseListener,false);

	//Whenever the Sheet gets updated in the controller/model, redraw it
	controller.addSubscriber(redrawSheet);

	redrawSheet();

});