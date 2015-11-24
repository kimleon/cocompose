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
		for (var i = (controller.dimY/16) - 1; i >= 0; i--) {
			drawLine([0,i*CELL_SIZE_Y*16],[CELL_SIZE_X*controller.dimX,i*CELL_SIZE_Y*16]);
		};

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

	//Whenever the Sheet gets updated in the controller/model, redraw it
	controller.addSubscriber(redrawSheet);

	$("#playButton").click(function(){
		controller.getMidiString();
	});

	// $(document).on('click', '#submit-new-collaborator', function(evt) {
	// 	console.log('submitting new collaborator');
	// 	var content = $('#add-collaborator-input').val();
	// 	if (content.trim().length === 0) {
	// 		alert('Input must not be empty');
	// 	 	return;
	// 	}
	// 	console.log("here: ", content)
		// $.post(
		// 	'/sheets',
		// 	{ content: content }
		// ).done(function(response) {
		// 	loadHomePage();
		// }).fail(function(responseObject) {
		// 	var response = $.parseJSON(responseObject.responseText);
		// 	$('.error').text(response.err);
		// });
	// });

	$("#submit-new-collaborator").click(function() {
		var collab = $('#add-collaborator-input').val();
		var currentURL = window.location.href;
		var sheetID = currentURL.split("/").pop();
		if (collab.trim().length === 0) {
			alert('Input must not be empty');
		 	return;
		}
		console.log("Collab: ", collab);
		$.post(
			'../sheets/' + sheetID + '/addCollab',
			{ collab: collab }
		).done(function(response) {
			console.log('done!');
		}).fail(function(responseObject) {
			var response = $.parseJSON(responseObject.responseText);
			$('.error').text(response.err);
		});
	});

	// $(document).on('click', '#submit-new-collaborator', function(evt) {
 //      var collab = $('#add-collaborator-input').val();
 //      console.log(collab);
 //      $.ajax({
 //        url: '/sheets/addCollab',
 //        type: 'POST'
 //      }).done(function(response) {
 //          console.log('done!');
 //      }).fail(function(responseObject) {
 //          var response = $.parseJSON(responseObject.responseText);
 //          $('.error').text(response.err);
 //          console.log(response.err);
 //      });
 //  	});

	redrawSheet();

});