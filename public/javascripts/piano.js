PianoKeys = function () {
	var that = Object.create(PianoKeys.prototype);

	var CELL_SIZE_X = 25;
	var CELL_SIZE_Y = 10;
	var PIANO_HEIGHT = 6;
	var canvas = document.getElementById('piano');
	canvas.style.border = "black 1px solid";
	var ctx = canvas.getContext('2d');

	var controller = Controller();
	var colorsBW = {0:"white", 1:"black", 2:"white", 3:"black", 4:"white", 5:"white", 6:"black", 7:"white", 8:"black", 9:"white", 10:"black", 11:"white"}
	var colorsNormal = {0:"#e74c3c",1:"#2980b9",2:"#e08283",3:"#f1c40f",4:"#8e44ad",5:"#16a085",6:"#d2527f",7:"#19b5fe",8:"#f27935",9:"#2ecc71",10:"#86e2d5",11:"#9a12b3"};
	var drawCell = function (coordX,coordY) {
		ctx.fillStyle = colorsBW[coordX%12];
		ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
	};
	var drawLine = function (startCoord, endCoord) {
		ctx.beginPath();
      	ctx.moveTo(startCoord[0], startCoord[1]);
      	ctx.lineTo(endCoord[0], endCoord[1]);
      	ctx.strokeStyle = '#CFCFCF';
      	ctx.stroke();
	};
	// Clears the Sheet and polls the controller to redraw it.
	var redrawSheet = function () {

		ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
		ctx.canvas.width = CELL_SIZE_X * controller.dimX;
		ctx.canvas.height = CELL_SIZE_Y * PIANO_HEIGHT;

		for (var i = controller.dimX - 1; i >= 0; i--) {
			for (var j = PIANO_HEIGHT - 1; j >= 0; j--) {
				drawCell(i,j);
			};
		};
		for (var i = controller.dimX - 1; i >= 0; i--) {
			drawLine([i*CELL_SIZE_X,0],[i*CELL_SIZE_X,CELL_SIZE_Y*controller.dimY]);
		};
	};

	isClicked = false;
	pianoClickListener = function(evt){
		var mouseCoordsToMouseCoords = function (mouseX,mouseY) {
			var canvasRect = canvas.getBoundingClientRect();

			xCoord = Math.floor((mouseX - canvasRect.left)/CELL_SIZE_X);
			yCoord = Math.floor((mouseY - canvasRect.top)/CELL_SIZE_Y);

			return [xCoord, yCoord];
		}

		cellCoords = mouseCoordsToMouseCoords(evt.clientX,evt.clientY);
		clickedColumn = cellCoords[0];
		if (isClicked){
			addKeyColor(clickedColumn);
			MIDI.noteOn(0, clickedColumn + 48, 50, 0);
		} else {
			MIDI.chordOff(0, Array.from(new Array(controller.dimX), (x,i) => i+48), 0);;
			redrawSheet();
		};
	};

	canvas.addEventListener("mousedown", function(evt){
		isClicked = true;
		pianoClickListener(evt);
	});

	canvas.addEventListener("mouseup", function(evt){
		isClicked = false;
		pianoClickListener(evt);
	});

	var colorKey = function (xCell, colorDict) {
		var drawCell = function (coordX,coordY) {
			ctx.fillStyle = colorDict[coordX%12];
			ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
		};

		for (var j = PIANO_HEIGHT - 1; j >= 0; j--) {
			drawCell(xCell,j);
		};
		drawLine([xCell*CELL_SIZE_X,0],[xCell*CELL_SIZE_X,CELL_SIZE_Y*controller.dimY]);
	};

	var addKeyColor = function (xCell) {
		colorKey(xCell, colorsNormal);
	};

	var resetKeyColor = function (xCell) {
		colorKey(xCell, colorsBW);
	};

	that.toggleKeyColor = function (xCell, isKeyColored) {
		if (isKeyColored) {
			addKeyColor(xCell);
		} else {
			resetKeyColor(xCell);
		};
	};

	redrawSheet();

	return that;

};