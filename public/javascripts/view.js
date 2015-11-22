document.addEventListener('DOMContentLoaded', function () {

	var CELL_SIZE_X = 25;
	var CELL_SIZE_Y = 10;

	var canvas = document.getElementById('sheet');
	canvas.style.border = "black 1px solid";
	var ctx = canvas.getContext('2d');

	var controller = Controller();

	// Clears the Sheet and polls the controller to redraw it.
	var redrawSheet = function () {
		var colors = {0:"#e74c3c",1:"#2980b9",2:"#e08283",3:"#f1c40f",4:"#8e44ad",5:"#16a085",6:"#d2527f",7:"#19b5fe",8:"#f27935",9:"#2ecc71",10:"#86e2d5",11:"#9a12b3"}
		var drawCell = function (coordX,coordY) {
			ctx.fillStyle = colors[coordX%12];
			ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
		};

		var drawLine = function (startCoord, endCoord) {
			ctx.beginPath();
	      	ctx.moveTo(startCoord[0], startCoord[1]);
	      	ctx.lineTo(endCoord[0], endCoord[1]);
	      	ctx.strokeStyle = '#CFCFCF';
	      	ctx.stroke();
		};


		ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
		ctx.canvas.width = CELL_SIZE_X * controller.dimX;
		ctx.canvas.height = CELL_SIZE_Y * controller.dimY;

		for (var i = controller.dimX - 1; i >= 0; i--) {
			drawLine([i*CELL_SIZE_X,0],[i*CELL_SIZE_X,CELL_SIZE_Y*controller.dimY]);
		};
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