document.addEventListener('DOMContentLoaded', function () {

	var CELL_SIZE_X = 25;
	var CELL_SIZE_Y = 10;

	var canvas = document.getElementById('sheet');
	canvas.style.border = "black 1px solid";
	var ctx = canvas.getContext('2d');

	pianoKeys = PianoKeys();
	// pianoKeys.toggleKeyColor(1,true);

	var controller = Controller();

	var drawLine = function (startCoord, endCoord) {
      	color = '#CFCFCF';
      	drawLineWithColor(startCoord, endCoord, color);
	};

	var drawLineWithColor = function (startCoord, endCoord, color) {
		ctx.beginPath();
      	ctx.moveTo(startCoord[0], startCoord[1]);
      	ctx.lineTo(endCoord[0], endCoord[1]);
      	ctx.strokeStyle = color;
      	ctx.stroke();
	};

	// Clears the Sheet and polls the controller to redraw it.
	var redrawSheet = function () {
		var colors = {0:"#e74c3c",1:"#2980b9",2:"#e08283",3:"#f1c40f",4:"#8e44ad",5:"#16a085",6:"#d2527f",7:"#19b5fe",8:"#f27935",9:"#2ecc71",10:"#86e2d5",11:"#9a12b3"}
		var drawCell = function (coordX,coordY) {
			ctx.fillStyle = colors[coordX%12];
			ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
		};



		ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
		ctx.canvas.width = CELL_SIZE_X * controller.dimX;
		ctx.canvas.height = CELL_SIZE_Y * controller.dimY;
		// ctx.fillStyle = "#FFFFFF";
		// ctx.fillRect(0, 0, canvas.width, canvas.height); //clear the canvas
		//Draw piano lines
		for (var i = controller.dimX - 1; i >= 0; i--) {
			drawLine([i*CELL_SIZE_X,0],[i*CELL_SIZE_X,CELL_SIZE_Y*controller.dimY]);
		};
		//Draw submeasure lines
		for (var i = (controller.dimY/4) - 1; i >= 0; i--) {
			drawLineWithColor([0,i*CELL_SIZE_Y*4],[CELL_SIZE_X*controller.dimX,i*CELL_SIZE_Y*4], '#E3E3E3');
		};
		//Draw notes
		var noteCells = controller.returnNoteCells();
		noteCells.map(function (coords) {
			drawCell(coords[0],coords[1]);
		});
		//Draw measure lines
		for (var i = (controller.dimY/16) - 1; i >= 0; i--) {
			drawLineWithColor([0,i*CELL_SIZE_Y*16],[CELL_SIZE_X*controller.dimX,i*CELL_SIZE_Y*16], '#ADADAD');
		};
		// //Draw submeasure lines
		// for (var i = (controller.dimY/8) - 1; i >= 0; i--) {
		// 	drawLineWithColor([0,i*CELL_SIZE_Y*8],[CELL_SIZE_X*controller.dimX,i*CELL_SIZE_Y*8], '#C8C8C8');
		// };

	};

	isDown = false;
	isClicked = false;
	clickedColumn = 0;
	mouseListener = function(evt){
		if (isDown) {
			var mouseCoordsToMouseCoords = function (mouseX,mouseY) {
				var canvasRect = canvas.getBoundingClientRect();

				xCoord = Math.floor((mouseX - canvasRect.left)/CELL_SIZE_X);
				yCoord = Math.floor((mouseY - canvasRect.top)/CELL_SIZE_Y);

				return [xCoord, yCoord];
			}

			cellCoords = mouseCoordsToMouseCoords(evt.clientX,evt.clientY);
			if (isClicked){
				clickedColumn = cellCoords[0];
			};
			if (cellCoords[0] === clickedColumn){
				if (evt.button === 0){
					controller.setCell(cellCoords[0], cellCoords[1], true);
				} else if (evt.button === 2) {
					controller.setCell(cellCoords[0], cellCoords[1], false);
				};
			};
		};
	};

	canvas.addEventListener("mousedown", function(evt){
		isDown = true;
		isClicked = true;
		mouseListener(evt);
		isClicked = false;
	});
	canvas.addEventListener("mouseup", function(evt){
		isDown = false;
	});

	// Listens for mouseclick to notify controller
	canvas.addEventListener("mousemove", mouseListener,false);

	controller.player = null;
	MIDI.loadPlugin({
		soundfontUrl: "../javascripts/soundfont/",
		onsuccess: function() {
			controller.player = MIDI.Player;
			controller.player.timeWarp = 1; // speed the song is played back
			// player.loadFile("data:audio/midi;base64,"+data, player.start);
			controller.player.addListener(function(data) {
				var pianoKey = data.note - 48;
				var noteOn = true;
				if (data.velocity === 0) {
					noteOn = false;
				};
				pianoKeys.toggleKeyColor(pianoKey, noteOn);
			});
			controller.player.setAnimation(function (data, element) {
				console.log(data);
				redrawSheet();
				if (data.now < data.end){
					pixelsPerUnitTime  = (CELL_SIZE_Y * 4) / .5;
					currentCursorPosition = ((data.now - .2505) * pixelsPerUnitTime) * (1.0/controller.player.timeWarp);
					drawLineWithColor([0,currentCursorPosition],[CELL_SIZE_X*controller.dimX,currentCursorPosition], '#181A7A');
				};
			});
		}
	});

	//Whenever the Sheet gets updated in the controller/model, redraw it
	controller.addSubscriber(redrawSheet);

	$("#playButton").click(function(){
		controller.player.timeWarp = 120.0/($("#BPM-input").val());
		controller.getMidiString();
	});

	$("#submit-new-collaborator").click(function() {
		var collab = $('#add-collaborator-input').val();
		var currentURL = window.location.href;
		var sheetID = currentURL.split("/").pop();
		if (collab.trim().length === 0) {
			alert('Input must not be empty');
		 	return;
		}
		$.post(
			'../sheets/' + sheetID + '/addCollab',
			{ collab: collab }
		).done(function(response) {
			$('.error').text("");
			location.reload();
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			console.log(response.err);
			$('.error').text(response.err);
		});
	});

	$(document).on('click', '.delete-collab', function(evt) {
		var item = $(this).parent();
		var currentURL = window.location.href;
		var sheetID = currentURL.split("/").pop();
		var name = item.data('collab-name');
		$.ajax({
		  url: '/sheets/' + sheetID + '/' + name,
		  type: 'DELETE'
		}).done(function(response) {
		  item.remove();
		}).fail(function(responseObject) {
		  var response = $.parseJSON(responseObject.responseText);
		  $('.error').text(response.err);
		});
	});

	redrawSheet();

});