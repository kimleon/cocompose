// Controller:
// + This module controls the sheet:
//     * Controls the timing
//     * Acts as an interface from the view to the model

var Controller = function () {
	var that = Object.create(Controller.prototype);

	var SHEET_WIDTH = 36;
	var SHEET_HEIGHT = 208;

	that.dimX = null;
	that.dimY = null;

	var model = null;
	var socket = null;
	var currentURL = window.location.href;
	var sheetID = currentURL.split("/").pop();

	var init = function () {
		sheetData = null
		socket = io.connect('/');
		socket.emit('request_sheet', { sheetID: sheetID });
		socket.emit('join_sheet', { sheetID: sheetID });
		socket.on('supply_sheet', function (data) {
		    noteData = [];
		    for (var i = data.length - 1; i >= 0; i--) {
		    	noteData.push([keyToCoord(data[i].pitch),data[i].time]);
		    };
		    that.setNewSheet(SHEET_WIDTH,SHEET_HEIGHT,noteData);
		});
		socket.on('note_update', function (data) {
			recieveNoteUpdate(data);
		});
		model = SheetModel(SHEET_WIDTH,SHEET_HEIGHT,[]);
		that.dimX = model.dimX;
		that.dimY = model.dimY;
		model.addSubscriber(that.notifySubscribers);
	};

	var notifyServer = function (cell) {
		socket.emit('note', {
			sheetID: sheetID,
			note: cell
		});
		console.log(cell);
	};

	var recieveNoteUpdate = function (data) {
		that.setCell(keyToCoord(data.note.pitch), data.note.time, data.note.isNote);
		that.notifySubscribers();
	};

	BASE_OCTAVE = 3
	var coordToKey = function (coordX) {
		pitches = {0:"C",1:"C#",2:"D",3:"D#",4:"E",5:"F",6:"F#",7:"G",8:"G#",9:"A",10:"A#",11:"B"}
		octave = BASE_OCTAVE + ~~(coordX/12);
		pitch = pitches[coordX%12];
		return pitch+octave;
	};

	var keyToCoord = function (key) {
		pitches = {"C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11}
		pitch = pitches[key.substring(0, key.length - 1)];
		octave = key.substring(key.length - 1, key.length) - BASE_OCTAVE;
		return 12*octave + pitch;
	};

	/** setNewSheet - Clears the sheet and adds any required notes
	* param dimX - x dimension of the sheet
	* param dimY - y dimension of the sheet
	* param arrayOfNoteCells - list of coordinates specifying which cells are alive
	*/
	that.setNewSheet = function (dimX, dimY, arrayOfNoteCells) {
		that.dimX = dimX;
		that.dimY = dimY;
		model = SheetModel(dimX,dimY,arrayOfNoteCells);
		model.addSubscriber(that.notifySubscribers);
		that.notifySubscribers();
	};

	that.setCell = function (coordX, coordY, value) {
		if (model.noteAtCell(coordX,coordY) != value){
			model.updateCell(coordX,coordY,value);
			var note = {
				pitch: coordToKey(coordX),
				time: coordY,
				isNote: value,
			}
			notifyServer(note);
		};
	};

	var subscribers = []

	/** addSubscriber - Add a function to the subscribers. 
	* These get called after every board update.
	* param fn - function to add to subscribers
	**/
	that.addSubscriber = function (fn) {
		subscribers.push(fn);
	};

	/** notifySubscribers - notifies all subscribers
	* All functions in subscribers get called.
	**/
	that.notifySubscribers = function () {
		subscribers.map(function (fn) {fn();});
	};

	/** noteAtCell - Returns whether the specified cell is note
	* param coordX - x coordinate of the cell
	* param coordY - y coordinate of the cell
	**/
	that.noteAtCell = function (coordX, coordY) {
		return model.noteAtCell(coordX,coordY);
	};

	/** returnNoteCells - returns a list of all cells that are Note. The cells are 
	* arrays of two numbers, the x coord and the y coord.
	**/
	that.returnNoteCells = function () {
		return model.returnNoteCells();
	};

	that.returnListOfMidiNotes = function () {
		var notes = [];
		var prevIsNote = false;
		var lastNoteStart = 0;
		for (var i = 0; i < that.dimX; i++) {
			var pitch = coordToKey(i);
			for (var j = 0; j < that.dimY; j++) {
				if (!prevIsNote && that.noteAtCell(i,j)) {
					lastNoteStart = j;
				} else if (prevIsNote && !that.noteAtCell(i,j)){
					notes.push({pitch: pitch, isNoteStart: true, time:lastNoteStart});
					notes.push({pitch: pitch, isNoteStart: false, time:j});
				};
				prevIsNote = that.noteAtCell(i,j);
			};
		};
		return notes;
	};

	that.getMidiString = function (){
		socket.emit('convert_sheet', that.returnListOfMidiNotes());
		socket.on('supply_midi', function (data) {
			console.log(data);
			that.playMidi(data);
		});
	};

	that.playMidi = function(midiString) {
		var startMeasure = $('#playback-start-measure-input').val();
		that.player.loadFile("data:audio/midi;base64,"+midiString, function () {
			that.player.currentTime = ((startMeasure - 1) * 2000 + 250) * that.player.timeWarp;
			that.player.start();
		});
	};

	init();

	return that;
};