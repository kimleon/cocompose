// Controller:
// + This module controls the sheet:
//     * Controls the timing
//     * Acts as an interface from the view to the model
//
// Lead Author: Lisandro Jimenez
//
var Controller = function () {
	var that = Object.create(Controller.prototype);

	var SHEET_WIDTH = 36;
	var SHEET_HEIGHT = 208;
	var NUMBER_OF_NOTES_IN_OCTAVE = 12;

	that.dimX = null;
	that.dimY = null;

	var model = null;
	var socket = null;
	var currentURL = window.location.href;
	var sheetID = currentURL.split("/").pop();

	/**
		Sets up socket.io connection.
		Sets up callback so that when a sheet is provided by the server, it is populated to the state array.
		Sets up callback so that when a note update is provided by the server (another user), it is 
		reflected in the state.
		Initializes the model.
	*/
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

	/** Sends a socket request notifiying the server that a note should be updated */
	var notifyServer = function (cell) {
		socket.emit('note', {
			sheetID: sheetID,
			note: cell
		});
	};

	/** Handles a note that is provided and updates the state accordingly*/
	var recieveNoteUpdate = function (data) {
		that.setCell(keyToCoord(data.note.pitch), data.note.time, data.note.isNote);
		that.notifySubscribers();
	};

	/** Converting between state array coords and MIDI notation*/
	BASE_OCTAVE = 3
	var coordToKey = function (coordX) {
		pitches = {0:"C",1:"C#",2:"D",3:"D#",4:"E",5:"F",6:"F#",7:"G",8:"G#",9:"A",10:"A#",11:"B"}
		octave = BASE_OCTAVE + ~~(coordX/NUMBER_OF_NOTES_IN_OCTAVE);
		pitch = pitches[coordX%NUMBER_OF_NOTES_IN_OCTAVE];
		return pitch+octave;
	};

	var keyToCoord = function (key) {
		pitches = {"C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11}
		pitch = pitches[key.substring(0, key.length - 1)];
		octave = key.substring(key.length - 1, key.length) - BASE_OCTAVE;
		return NUMBER_OF_NOTES_IN_OCTAVE*octave + pitch;
	};

	/** setNewSheet - Clears the sheet and adds any required notes
	* If dimensions are not numbers, simply throw an error
	* param dimX - x dimension of the sheet
	* param dimY - y dimension of the sheet
	* param arrayOfNoteCells - list of coordinates specifying which cells are alive
	*/
	that.setNewSheet = function (dimX, dimY, arrayOfNoteCells) {
		if ((isNaN(dimX)) || (isNaN(dimY))) {
		  throw "Dimensions are not valid";
		};
		that.dimX = dimX;
		that.dimY = dimY;
		model = SheetModel(dimX,dimY,arrayOfNoteCells);
		model.addSubscriber(that.notifySubscribers);
		that.notifySubscribers();
	};

	/** setCell - Sets the cell at the specified x and y coords to value, and notifies the server
	*	if the cell has changed state.
	*	If the specified coordinates are not valid, do nothing.
	* 	param coordX - x coordinate of the cell
	* 	param coordY - y coordinate of the cell
	* 	param value - value to set the cell
	**/
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
	* If coordinates are not numbers, throw an error
	* param coordX - x coordinate of the cell
	* param coordY - y coordinate of the cell
	**/
	that.noteAtCell = function (coordX, coordY) {
		if((isNaN(coordX)) || (isNaN(coordY))){
		  throw "Coordinates are not valid";
		};
		return model.noteAtCell(coordX,coordY);
	};

	/** returnNoteCells - returns a list of all cells that are Note. The cells are 
	* arrays of two numbers, the x coord and the y coord.
	**/
	that.returnNoteCells = function () {
		return model.returnNoteCells();
	};

	/** returnListOfMidiNotes - Returns a list of notes in the sheet in a format ready to be sent to
	*	the server for MIDI conversion.
	*	Note Format: {pitch: pitch, isNoteStart: true/false, time:noteStart/noteEnd}
	**/
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

	/** getMidiStringAndPlay - Sends request to the server
	*	to convert the sheet to MIDI, then begins
	*	playing at the measure specified at startMeasure.
	*	If startMeasure is not valid, start from the top.
	* 	param startMeasure - Measure from which to begin playback
	**/
	that.getMidiStringAndPlay = function (startMeasure){
		if(isNaN(startMeasure)){
		  startMeasure = 0;
		}
		socket.emit('convert_sheet', that.returnListOfMidiNotes());
		socket.on('supply_midi', function (data) {
			that.playMidi(data, startMeasure);
		});
	};

	/** playMidi - begins playing midiString from measure startMeasure
	* 	param midiString - base64 MIDI string to play back
	* 	param startMeasure - Measure from which to begin playback
	**/
	var TICKS_PER_MEASURE = 2000;
	var PLAYBACK_OFFSET = 250; //begin playing 250 ticks into the song; MIDI.js bug workaround
	that.playMidi = function(midiString, startMeasure) {
		var startMeasure = $('#playback-start-measure-input').val();
		that.player.loadFile("data:audio/midi;base64,"+midiString, function () {
			that.player.currentTime = ((startMeasure - 1) * TICKS_PER_MEASURE + PLAYBACK_OFFSET) * that.player.timeWarp;
			that.player.start();
		});
	};

	init();

	return that;
};