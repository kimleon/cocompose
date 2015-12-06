var fs = require('fs');
var Midi = require('jsmidgen');
var express = require('express');
var atob = require('atob')
var btoa = require('btoa')

var generateMidi = function (listOfNotes) {
	var file = new Midi.File();
	var track = new Midi.Track();
	file.addTrack(track);
	track.note(0, 'c11', 32);
	track.note(0, 'd11', 32);

	listOfNotes.sort(function(a,b) {
		return a.time - b.time;
	});
	
	var prevTime = 0;
	for (var i = 0; i < listOfNotes.length; i++) {
		var currentNote = listOfNotes[i];
		if (currentNote.isNoteStart){
			track.noteOn(0, currentNote.pitch, 32*(currentNote.time - prevTime));
		} else {
			track.noteOff(0, currentNote.pitch, 32*(currentNote.time - prevTime));
		};
		prevTime = currentNote.time;
	};
	return btoa(file.toBytes());
};

module.exports = generateMidi;