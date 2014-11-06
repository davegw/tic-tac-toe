(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MenuController = require('./controllers/MenuController');

new MenuController();

},{"./controllers/MenuController":3}],2:[function(require,module,exports){
var Game = require('../models/Game');

var ApplicationController = function(size, players) {
  this.game = new Game(size, players);
  this.statusEl = document.getElementById('status');
  this.boardEl = document.getElementById('board');
  this.initialize();
};

ApplicationController.prototype = {
  initialize: function() {
    this.buildBoard();
  },

  // Build the game board view.
  buildBoard: function() {
    if (!this.boardEl) {
      return 'No board element';
    }

    // Build an array of cell DOM elements to add to onresize listener.
    var cells = [];
    this.game.board._board.forEach(function(row, rowIdx) {
      // Create and append row class div to the board div for each row.
      var rowElement = document.createElement('div');
      rowElement.className = 'row';
      this.boardEl.appendChild(rowElement);

      row.forEach(function(_col, colIdx) {
        // Create and append cell class div to each column in each row.
        var cell = document.createElement('div');
        cell.className = 'cell';
        rowElement.appendChild(cell);

        // Create a marker class div and append to the above cell class div.
        var marker = document.createElement('div');
        marker.className = 'marker';
        cell.appendChild(marker);

        // Add a click handler to each cell for handling game flow and logic.
        cell.onclick = function() {
          this.cellClickHandler(rowIdx, colIdx, cell);
        }.bind(this);

        cells.push(cell);

      }.bind(this));
    }.bind(this));

    // Resize the board dimensions whenever the window is resized.
    window.onresize = function() {
      this.resizeBoard(cells);
    }.bind(this);

    // Set the initial board size.
    this.resizeBoard(cells);
  },

  // Handles cell click events by updating game model, view and status.
  cellClickHandler: function(row, col, cell) {
    // Check for game over or occupied scenario and do not take action if found.
    if (this.statusEl.className.match(/\bgame-over\b/)) {
      return;
    }
    if (cell.className.match(/\boccupied\b/)) {
      return this.statusEl.innerHTML = 'That space is already taken!';
    }

    // Clear status message.
    this.statusEl.innerHTML = '';

    // Process and display the move.
    this.game.move(row, col);
    this.printCell(row, col);

    // Check for game ending event and display status message if found.
    if (this.game.checkForWin(row, col)) {
      this.printWinningCombo(row, col);
      this.gameOver();
      return this.statusEl.innerHTML = 'Player ' + this.game.board.get(row, col) + ' wins!';
    }
    if (this.game.checkGameOver()) {
      this.gameOver();
      return this.statusEl.innerHTML = 'Tie!';
    }

    this.statusEl.innerHTML = "Player " + this.game.currentPlayer.marker + "'s Turn";
  },

  // Resize board dimensions based on the window width.
  resizeBoard: function(cells) {
    // Calculate the cell width based on the board width and number of cells per row.
    // Subtract 1 to avoid rounding bug that cause cells to be wider than board.
    var cellSize = (this.boardEl.clientWidth - 1) / this.game.board.size;
    cells.forEach(function(cell) {
      cell.setAttribute("style", "width: " + cellSize + "px; height: " + cellSize + "px");
    });
  },

  // Render the cell at the inputted row and column.
  printCell: function(row, col) {
    var cell = document.getElementsByClassName('row')[row].children[col];
    cell.className += ' occupied';
    cell.children[0].innerHTML = this.game.board.get(row, col);
  },

  // Add styling to the game winning cell combination.
  printWinningCombo: function(row, col) {
    winningCells = this.game.winningCells(row, col);
    var rows = document.getElementsByClassName('row');
    for (var i=0; i<winningCells.length; i++) {
      var cell = winningCells[i];
      var cellEl = rows[cell[0]].children[cell[1]];

      // Add styling with a delay to create sequential animation.
      setTimeout(function() {
        // Store a reference to current element in closure scope.
        // Otherwise variable will have changed when function is invoked.
        var delayedCellEl = cellEl;

        return function() {
          delayedCellEl.className += ' winner';
        };
      }(), (2000 * i / winningCells.length));
    }
  },

  // Add styling for game over event.
  gameOver: function() {
    this.statusEl.className += ' game-over';
    this.boardEl.className += ' game-over';
  },

  // Reset the game board and status message for the next game.
  resetGame: function() {
    this.statusEl.innerHTML = '';
    this.boardEl.innerHTML = '';
    this.statusEl.className = '';
    this.boardEl.className = '';
  }
};

module.exports = ApplicationController;

},{"../models/Game":5}],3:[function(require,module,exports){
var ApplicationController = require('./ApplicationController');

var MenuController = function() {
  this.app = new ApplicationController();
  this.newGameButton = document.getElementById('new-game');
  this.initialize();
};

MenuController.prototype = {
  initialize: function() {
    if (this.newGameButton) {
      this.newGameButton.onclick = this.newGameHandler.bind(this);
    }
  },

  // Handle new game click event by loading an empty board with the desired settings.
  newGameHandler: function() {
    this.app.resetGame();
    this.app = new ApplicationController(
                    +document.getElementById('game-size-selector').value,
                    +document.getElementById('game-players-selector').value);
  }
};

module.exports = MenuController;

},{"./ApplicationController":2}],4:[function(require,module,exports){
var Board = (function(size) {
  // Set default size to 3 if none entered.
  this.size = size || 3;

  // Prefill a size x size matrix with null values.
  var board = Array.apply(null, Array(this.size)).map(function() {
    return Array.apply(null, Array(this.size)).map(function() {
      return null;
    });
  }.bind(this));

  // Make the board matrix private.
  this._board = (function(){
    return board;
  })();

  // Use getter and setter methods to access the board.
  this.get = function(row, col) {
    return board[row][col];
  };

  this.set = function(row, col, value) {
    return board[row][col] = value;
  };
});

Board.prototype = {
  // Check if input row contains all of same marker. Returns true or false.
  checkRow: function(row) {
    if (row < 0 || row >= this.size) {
      throw new Error("Invalid row inputted at checkRow");
    }

    var marker = this.get(row, 0);
    if (marker === null) {
      return false;
    }

    return this._board[row].every(function(cell) {
      return cell === marker;
    });
  },

  // Check if input column contains all of same marker. Returns true or false.
  checkCol: function(col) {
    if (col < 0 || col >= this.size) {
      throw new Error("Invalid column inputted at checkCol");
    }

    var marker = this.get(0, col);
    if (marker === null) {
      return false;
    }

    return this._board.every(function(row) {
      return row[col] === marker;
    });
  },

  checkMajorDiag: function() {
    var majorDiag = this.get(0, 0);
    return majorDiag !== null && this._board.every(function(row, idx) {
      return row[idx] === majorDiag;
    });
  },

  checkMinorDiag: function() {
    var minorDiag = this.get(0, this.size - 1);

    return minorDiag !== null && this._board.every(function(row, idx) {
      return row[this.size - 1 - idx] === minorDiag;
    }.bind(this));
  },

  // Check if diagonals contain all of same marker. Returns true or false.
  checkDiag: function() {
    return this.checkMajorDiag() || this.checkMinorDiag();
  }
};

module.exports = Board;

},{}],5:[function(require,module,exports){
var Player = require('./Player');
var Board = require('./Board');

var Game = function(size, players) {
  // Set default players to 2.
  var players = players || 2;
  var playerMarkers = ['O', 'X', 'Y', 'Z'];

  // Assign players with the appropriate marker for the number of players.
  this.players = Array.apply(null, Array(players)).map(function(player, idx) {
    return new Player(playerMarkers[idx]);
  });

  // Set the current player to the first marker in the players array.
  this.currentPlayer = this.players[0];
  this.board = new Board(size);
  this.moves = 0;
};

Game.prototype = {
  // Place the current player's marker at the designated cell.
  move: function(row, col) {
    if (this.board.get(row, col) !== null) {
      throw new Error("Cell occupied");
    }
    this.board.set(row, col, this.currentPlayer.marker);
    this.moves++;
    this.toggleTurn();
  },

  // Toggle current player to the next player.
  toggleTurn: function() {
    this.currentPlayer = this.players[this.moves % this.players.length];
  },

  // Check if board contains all of same marker in row, column or diagonal. 
  // Returns true or false.
  checkForWin: function(row, col) {
    return this.board.checkRow(row) || this.board.checkCol(col) || this.board.checkDiag();
  },

  // Check if all cells have been filled. Returns true or false.
  checkGameOver: function() {
    return this.moves === this.board.size*this.board.size;
  },

  // Return an array containing the coordinates of the winning cells.
  winningCells: function(row, col) {
    if (this.board.checkRow(row)) {
      return this.board._board.map(function(_row, idx) {
        return [row, idx];
      });
    }
    if (this.board.checkCol(col)) {
      return this.board._board.map(function(_row, idx) {
        return [idx, col];
      });
    }
    if (this.board.checkMajorDiag()) {
      return this.board._board.map(function(_row, idx) {
        return [idx, idx];
      });
    }
    if (this.board.checkMinorDiag()) {
      return this.board._board.map(function(_row, idx) {
        return [this.board.size - idx - 1, idx];
      }.bind(this));
    }
  }
};

module.exports = Game;

},{"./Board":4,"./Player":6}],6:[function(require,module,exports){
var Player = function(marker) {
  this.marker = marker;
};

module.exports = Player;

},{}]},{},[1]);
