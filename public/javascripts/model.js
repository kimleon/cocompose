// This contains the state of the sheet:
//       * Dimensions
//       * Which cells are notes or rests
//   + Also contains a Cell class, which makes it easier to use functional idioms with an array
//
// Lead Author: Lisandro Jimenez
//
var SheetModel = function (dimX, dimY, startingState) {

	/**
		Cell class, used for each cell, which contains x,y coords 
		and val (whether a cell is a note or not)
	*/
	var Cell = function (coordX, coordY, val) {
		var that = Object.create(Cell.prototype);
		that.coordX = coordX;
		that.coordY = coordY;
		that.val = val;

		return that;
	};

	var that = Object.create(SheetModel.prototype);

	that.dimX = dimX;
	that.dimY = dimY;

	//This array will contain the state of the application; two dimensional.
	var stateArray = [];

	/**
		Sets the starting array to an empty 2D array. 
	*/
	var initStateArray = function () {
		stateArray = createEmpty2DArray(dimX,dimY);
		startingState.map(function (coords) {
			that.updateCell(coords[0],coords[1], true);

		});
	};

	//Use of functionals: maps to every Cell in the Sheet
	var mapToAllCells = function (array2D, fn) {
		array2D.map(function (subArray) {
				subArray.map(fn);
			}
		);
	};

	/** updateCell - changes the value of the Cell at coordX,coordY to newValue
	* If coordinates invalid, throw a error;
	* If newValue not a boolean, throw an error.
	* param coordX - x coordinate of the cell
	* param coordY - y coordinate of the cell
	* param newValue - boolean value to set 
	**/
	that.updateCell = function (coordX, coordY, newValue) {
		if ((coordX > dimX) || (coordY > dimY)) {
			throw "error: Coordinates are too large!";
		};

		if (typeof(newValue) !== "boolean") {
			throw "error: newValue is wrong type!";
		};
		stateArray[coordX][coordY] = Cell(coordX, coordY, newValue);

		notifySubscribers();
	};

	var subscribers = [];

	/** addSubscriber - Add a function to the subscribers. 
	* These get called after every board update.
	* param fn - function to add to subscribers
	**/
	that.addSubscriber = function (fn) {
		subscribers.push(fn);
	};

	/** Call all subscribed functions*/
	var notifySubscribers = function () {
		subscribers.map(function (fn) {fn();});
	};

	/** Returns a two dimensional array of size x by y, filled with cells in a false state*/
	var createEmpty2DArray = function (x, y) {
		var emptyArray = [];
		for (var i = x - 1; i >= 0; i--) {
			emptyArray[i] = [];
			for (var j = y - 1; j >= 0; j--) {
				emptyArray[i][j] = Cell(i,j,false);
			};
		};
		return emptyArray;
	}

	/** noteAtCell - Checks whether cell is a note 
	* If coordinates not valid, throw an error.
	* param coordX - x coordinate of the cell
	* param coordY - y coordinate of the cell
	**/
	that.noteAtCell = function (coordX, coordY) {
		if ((dimX > coordX) && (dimY > coordY) && (coordX >= 0) && (coordY >= 0)){
			return stateArray[coordX][coordY].val;
		} else {
			throw "Querying for a cell that does not exist";
		};
	};

	/** returnNoteCells - returns a list of all cells that are note. The cells are 
	* arrays of two numbers, the x coord and the y coord.
	**/
	that.returnNoteCells = function () {
		var noteCells = [];
		mapToAllCells(stateArray, function (cell) {
			if (cell.val) {
				noteCells.push([cell.coordX,cell.coordY]);
			};
		});
		return noteCells;
	}

	initStateArray();

	return that;
};
