// This is the main View code;
// We used a canvas to implenent our grid UI, jQuery to register button callbacks,
// and MIDI.js to help with music playback
//
// Lead Author: Lisandro Jimenez
//
document.addEventListener('DOMContentLoaded', function () {

	var CELL_SIZE_X = 25;
	var CELL_SIZE_Y = 10;
	var NOTES_IN_AN_OCTAVE = 12;
	var LIGHT_GRAY = '#CFCFCF';
	var LIGHTER_GRAY = '#E3E3E3'
	var DARK_GRAY = '#ADADAD';
	var DARK_BLUE = '#181A7A';

	var canvas = document.getElementById('sheet');
	canvas.style.border = "black 1px solid";
	var ctx = canvas.getContext('2d');

	pianoKeys = PianoKeys();

	var controller = Controller();

	/**Draw a line on the canvas from startCoord to endCoord, with a light gray color **/
	var drawLine = function (startCoord, endCoord) {
		color = LIGHT_GRAY;
		drawLineWithColor(startCoord, endCoord, color);
	};

	/**Draw a line on the canvas from startCoord to endCoord, with line color specified by param color (hex color code) **/
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
		var cellsPerSubmeasure = 4;
		var cellsPerMeasure = 16;
		var drawCell = function (coordX,coordY) {
			ctx.fillStyle = colors[coordX%NOTES_IN_AN_OCTAVE];
			ctx.fillRect(coordX * CELL_SIZE_X, coordY * CELL_SIZE_Y, CELL_SIZE_X, CELL_SIZE_Y);
		};
		ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
		ctx.canvas.width = CELL_SIZE_X * controller.dimX;
		ctx.canvas.height = CELL_SIZE_Y * controller.dimY;
		//Draw piano lines
		for (var i = controller.dimX - 1; i >= 0; i--) {
			drawLine([i*CELL_SIZE_X,0],[i*CELL_SIZE_X,CELL_SIZE_Y*controller.dimY]);
		};
		//Draw submeasure lines
		for (var i = (controller.dimY/cellsPerSubmeasure) - 1; i >= 0; i--) {
			drawLineWithColor([0,i*CELL_SIZE_Y*cellsPerSubmeasure],[CELL_SIZE_X*controller.dimX,i*CELL_SIZE_Y*cellsPerSubmeasure], LIGHTER_GRAY);
		};
		//Draw notes
		var noteCells = controller.returnNoteCells();
		noteCells.map(function (coords) {
			drawCell(coords[0],coords[1]);
		});
		//Draw measure lines
		for (var i = (controller.dimY/cellsPerMeasure) - 1; i >= 0; i--) {
			drawLineWithColor([0,i*CELL_SIZE_Y*cellsPerMeasure],[CELL_SIZE_X*controller.dimX,i*CELL_SIZE_Y*cellsPerMeasure], DARK_GRAY);
		};

	};

	/**
		Logic for handling canvas clicks
		When a user clicks the canvas, a note is added at the cell clicked, if it doesn't already
		exist. If a user right clicks the canvas, then the note is removed from the cell clicked,
		if a note exists there.
	*/
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
	// Listens for mouseclicks to notify controller
	canvas.addEventListener("mousedown", function(evt){
		isDown = true;
		isClicked = true;
		mouseListener(evt);
		isClicked = false;
	});
	canvas.addEventListener("mouseup", function(evt){
		isDown = false;
	});
	canvas.addEventListener("mousemove", mouseListener,false);

	/**
		Load the MIDI player
		Adds callbacks to color the piano as the song is playing and
		to draw a blue playback line on the canvas as the song is playing.
	*/
	var LOWEST_NOTE_IN_MIDI = 48;
	controller.player = null;
	MIDI.loadPlugin({
		soundfontUrl: "../javascripts/soundfont/",
		onsuccess: function() {
			controller.player = MIDI.Player;
			controller.player.timeWarp = 1; // speed the song is played back
			controller.player.addListener(function(data) { //add color to keys when playing back
				var pianoKey = data.note - LOWEST_NOTE_IN_MIDI;
				var noteOn = true;
				if (data.velocity === 0) {
					noteOn = false;
				};
				pianoKeys.toggleKeyColor(pianoKey, noteOn);
			});
			controller.player.setAnimation(function (data, element) { //draw blue playback line
				redrawSheet();
				if (data.now < data.end){
					var pixelsPerUnitTime  = (CELL_SIZE_Y * 4) / .5;
					var cursorOffset = .2505;
					currentCursorPosition = ((data.now - cursorOffset) * pixelsPerUnitTime) * (1.0/controller.player.timeWarp);
					drawLineWithColor([0,currentCursorPosition],[CELL_SIZE_X*controller.dimX,currentCursorPosition], DARK_BLUE);
				};
			});
		}
	});

	//Whenever the Sheet gets updated in the controller/model, redraw it
	controller.addSubscriber(redrawSheet);


	$( "#measure-count-input" )
  	.focusout(function() {
	    var measureInput = $( "#measure-count-input" ).val();
	    var currentURL = window.location.href;
			var sheetID = currentURL.split("/").pop();
	    if (isNaN(measureInput)){
				alert("Must input a number for number of measures");
				return;
			}
			$.post(
				'../sheets/' + sheetID + '/updateMeasures',
				{ mCount: measureInput }
			).done(function(response) {
				$('.error').text("");
				location.reload();
			}).fail(function(responseObject) {
				var response = $.parseJSON(responseObject.responseText);
				$('.error').text(response.err);
			});
	  });

	$( "#BPM-input" )
  	.focusout(function() {
	    var BPMInput = $( "#BPM-input" ).val();
	    var currentURL = window.location.href;
			var sheetID = currentURL.split("/").pop();
	    if (isNaN(BPMInput)){
				alert("Must input a number for BPM");
				return;
			}
			$.post(
				'../sheets/' + sheetID + '/updateBPM',
				{ bpm: BPMInput }
			).done(function(response) {
				$('.error').text("");
				location.reload();
			}).fail(function(responseObject) {
				var response = $.parseJSON(responseObject.responseText);
				$('.error').text(response.err);
			});
	  });


	/**
		On play button click, call the controller to fetch the MIDI string and begin playing it.
		Sets the tempo to the input value provided and checks to make sure it is indeed a number.
	*/
	var DEFAULT_BPM = 120.0
	$("#playButton").click(function(){
		var bpmInput = $("#BPM-input").val();
		if (isNaN(bpmInput)){
			alert("Must input a number for BPM");
			return;
		}
		var startMeasure = $('#playback-start-measure-input').val();
		if (isNaN(startMeasure)){
			alert("Start measure must be a number.");
			return;
		};
		controller.player.timeWarp = DEFAULT_BPM/($("#BPM-input").val());
		controller.getMidiStringAndPlay(startMeasure);
	});

	/**
	    When the add button is pressed to add a collaborator, posts the data to the
	    server and upon successful completion, add the collaborator to the list of 
	    collaborators for the sheet and reload the page displaying the additional 
	    collaborator.
	*/
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
			$('.error').text(response.err);
		});
	});

	/**
	    When the delete button is pressed next to a collaborator, posts the data to the
	    server and upon successful completion, deletes the collaborator from the list of 
	    collaborators for the sheet and removes the collaborator from the list of displayed 
	    collaborators for the sheet.
	*/
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