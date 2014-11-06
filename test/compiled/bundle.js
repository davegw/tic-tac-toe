(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Game = require('../models/Game');

var GameController = function(size, players) {
  this.game = new Game(size, players);
  this.statusEl = document.getElementById('status');
  this.boardEl = document.getElementById('board');
  this.initialize();
};

GameController.prototype = {
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

module.exports = GameController;

},{"../models/Game":4}],2:[function(require,module,exports){
var GameController = require('./GameController');

var MenuController = function() {
  this.app = new GameController();
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
    this.app = new GameController(
                    +document.getElementById('game-size-selector').value,
                    +document.getElementById('game-players-selector').value);
  }
};

module.exports = MenuController;

},{"./GameController":1}],3:[function(require,module,exports){
var Board = function(size) {
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
};

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

},{}],4:[function(require,module,exports){
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

},{"./Board":3,"./Player":5}],5:[function(require,module,exports){
var Player = function(marker) {
  this.marker = marker;
};

module.exports = Player;

},{}],6:[function(require,module,exports){
require('./spec/BoardSpec');
require('./spec/PlayerSpec');
require('./spec/GameSpec');
require('./spec/GameControllerSpec');
require('./spec/MenuControllerSpec');

},{"./spec/BoardSpec":7,"./spec/GameControllerSpec":8,"./spec/GameSpec":9,"./spec/MenuControllerSpec":10,"./spec/PlayerSpec":11}],7:[function(require,module,exports){
var expect = chai.expect;
var Board = require('../../app/models/Board');

module.exports = describe('Board', function(){
  var board;
  beforeEach(function(){
    board = new Board(3);
  });

  describe('size', function(){
    it('should return the size inputted', function(){
      expect(board.size).to.equal(3);
    });
  });
  describe('board instance', function(){
    it('should return an appropriately sized board array', function(){
      expect(Array.isArray(board._board)).to.be.true;
      expect(board._board.length).to.equal(3);
      expect(board._board[0].length).to.equal(3);
    });
    it('should return a board with all spaces set to null', function(){
      board._board.forEach(function(row) {
        row.forEach(function(cell) {
          expect(cell).to.be.null;
        });
      });
    });
  });
  describe('get and set', function(){
    it('should set and get values on the board', function(){
      board.set(0, 0, 'O');
      board.set(2, 1, 'X');
      board.set(1, 2, 'O');
      expect(board.get(0, 0)).to.equal('O');
      expect(board.get(2, 1)).to.equal('X');
      expect(board.get(1, 2)).to.equal('O');
      expect(board.get(2, 2)).to.be.null;
    });
  });
  describe('check board rows, columns and diagonals', function(){
    it('should return the correct state of a row', function(){
      board.set(0, 0, 'O');
      board.set(0, 1, 'O');
      board.set(0, 2, 'O');
      expect(board.checkRow(0)).to.be.true;
      expect(board.checkRow(1)).to.be.false;
      expect(board.checkRow(2)).to.be.false;
      board.set(0, 1, 'X');
      expect(board.checkRow(0)).to.be.false;
    });
    it('should return the correct state of a column', function(){
      board.set(0, 1, 'X');
      board.set(1, 1, 'X');
      board.set(2, 1, 'X');
      expect(board.checkCol(0)).to.be.false;
      expect(board.checkCol(1)).to.be.true;
      expect(board.checkCol(2)).to.be.false;
      board.set(2, 1, 'O');
      expect(board.checkCol(1)).to.be.false;
    });
    it('should return the correct state of diagonals', function(){
      board.set(0, 0, 'O');
      board.set(0, 1, 'O');
      board.set(0, 2, 'O');
      expect(board.checkDiag()).to.be.false;
      board.set(1, 1, 'O');
      board.set(2, 2, 'O');
      expect(board.checkDiag()).to.be.true;
      board.set(2, 2, 'X');
      expect(board.checkDiag()).to.be.false;
      board.set(2, 0, 'O');
      expect(board.checkDiag()).to.be.true;
    });
  });
});

},{"../../app/models/Board":3}],8:[function(require,module,exports){
var expect = chai.expect;
var GameController = require('../../app/controllers/GameController');
var Game = require('../../app/models/Game');

module.exports = describe('Game Controller', function(){
  var app;
  beforeEach(function(){
    app = new GameController(3);
  });

  describe('properties', function(){
    it('should have a game instance property', function(){
      expect(app.game instanceof Game).to.be.true;
      expect(app.game.board.size).to.equal(3);
      expect(app.game.board.checkDiag()).to.be.false;
      app.game.move(1, 1);
      expect(app.game.board.get(1, 1)).to.equal('O');

    });
  });
  describe('methods', function(){
    it('should have a initialize method', function(){
      expect(app.initialize).to.be.a('function');
    });
    it('should have a buildBoard method', function(){
      expect(app.buildBoard).to.be.a('function');
    });
    it('should have a cellClickHandler method', function(){
      expect(app.cellClickHandler).to.be.a('function');
    });
    it('should have a printCell method', function(){
      expect(app.printCell).to.be.a('function');
    });
    it('should have a printWinningCombo method', function(){
      expect(app.printWinningCombo).to.be.a('function');
    });
    it('should have a gameOver method', function(){
      expect(app.gameOver).to.be.a('function');
    });
    it('should have a resetGame method', function(){
      expect(app.resetGame).to.be.a('function');
    });
  });

  var customApp;
  beforeEach(function(){
    customApp = new GameController(6, 4);
  });
  describe('custom settings', function(){
    describe('should have a custom size setting', function(){
      it('should create a custom size board', function(){
        expect(customApp.game.board.size).to.equal(6);
        customApp.game.move(1, 2);
        expect(customApp.game.board.get(1, 2)).to.equal('O');
      });
    });
    describe('should have a custom player setting', function(){
      it('should create a custom number of players', function(){
        expect(customApp.game.players.length).to.equal(4);
      });
      it('should keep track of the current player', function(){
        expect(customApp.game.currentPlayer.marker).to.equal('O');
        customApp.game.move(1, 2);
        expect(customApp.game.currentPlayer.marker).to.equal('X');
        customApp.game.move(1, 5);
        expect(customApp.game.currentPlayer.marker).to.equal('Y');
        customApp.game.move(0, 3);
        expect(customApp.game.currentPlayer.marker).to.equal('Z');
        customApp.game.move(5, 1);
        expect(customApp.game.currentPlayer.marker).to.equal('O');
        customApp.game.move(3, 3);
        expect(customApp.game.currentPlayer.marker).to.equal('X');
      });
    });
  });
});

},{"../../app/controllers/GameController":1,"../../app/models/Game":4}],9:[function(require,module,exports){
var expect = chai.expect;
var Game = require('../../app/models/Game');
var Board = require('../../app/models/Board');
var Player = require('../../app/models/Player');

module.exports = describe('Game', function(){
  var game;
  beforeEach(function(){
    game = new Game(3);
  });

  describe('board', function(){
    it('should create a properly instantiated board', function(){
      expect(game.board instanceof Board).to.be.true;
      expect(game.board.size).to.equal(3);
      game.board._board.forEach(function(row) {
        row.forEach(function(cell) {
          expect(cell).to.be.null;
        });
      });
    });
  });
  describe('players', function(){
    it('should create two players', function(){
      expect(game.players.length).to.equal(2);
      expect(game.players[0] instanceof Player).to.be.true;
      expect(game.players[0].marker).to.equal('O');
      expect(game.players[1] instanceof Player).to.be.true;
      expect(game.players[1].marker).to.equal('X');
    });
    it('should set "O" as the current player to move', function(){
      expect(game.currentPlayer.marker).to.equal('O');
    });
  });
  describe('toggle turn', function(){
    it('should toggle the current player after each move', function(){
      expect(game.currentPlayer.marker).to.equal('O');
      game.move(0, 0);
      expect(game.currentPlayer.marker).to.equal('X');
      game.move(0, 1);
      expect(game.currentPlayer.marker).to.equal('O');
      game.move(0, 2);
      expect(game.currentPlayer.marker).to.equal('X');
    });
  });
  describe('move', function(){
    it('should place the piece in the correct cell', function(){
      game.move(0, 0);
      game.move(0, 1);
      expect(game.board.get(0, 0)).to.equal('O');
      expect(game.board.get(0, 1)).to.equal('X');
      game.move(2, 2);
      expect(game.board.get(2, 2)).to.equal('O');
    });
    it('should count the correct number of moves', function(){
      expect(game.moves).to.equal(0);
      game.move(0, 0);
      expect(game.moves).to.equal(1);
      game.move(0, 1);
      expect(game.moves).to.equal(2);
      game.move(0, 2);
      expect(game.moves).to.equal(3);
    });
  });
  describe('game states', function(){
    it('should return when a player has won', function(){
      game.move(0, 0);
      game.move(1, 0);
      game.move(0, 1);
      game.move(1, 2);
      expect(game.checkForWin(0, 2)).to.be.false;
      game.move(0, 2);
      expect(game.checkForWin(0, 2)).to.be.true;
      game.move(2, 2);
      game.move(1, 1);
      game.move(2, 1);
      expect(game.checkForWin(2, 1)).to.be.false;
      game.move(2, 0);
      expect(game.checkForWin(2, 0)).to.be.true;
    });
    it('should return whether the board is filled', function(){
      game.move(0, 0);
      game.move(0, 1);
      game.move(0, 2);
      expect(game.checkGameOver()).to.be.false;
      game.move(1, 0);
      game.move(1, 1);
      game.move(1, 2);
      expect(game.checkGameOver()).to.be.false;
      game.move(2, 0);
      game.move(2, 1);
      game.move(2, 2);
      expect(game.checkGameOver()).to.be.true;
    });
  });
  describe('winning cells', function(){
    it('should return an array of the winning row', function(){
      game.move(0, 0);
      game.move(1, 0);
      game.move(0, 1);
      game.move(1, 2);
      game.move(0, 2);
      expect(game.winningCells(0, 2)).to.eql([[0, 0], [0, 1], [0, 2]]);
    });
    it('should return an array of the winning column', function(){
      game.move(0, 2);
      game.move(1, 0);
      game.move(1, 2);
      game.move(1, 1);
      game.move(2, 2);
      expect(game.winningCells(2, 2)).to.eql([[0, 2], [1, 2], [2, 2]]);
    });
    it('should return an array of the winning major diagonal', function(){
      game.move(0, 0);
      game.move(1, 0);
      game.move(1, 1);
      game.move(1, 2);
      game.move(2, 2);
      expect(game.winningCells(2, 2)).to.eql([[0, 0], [1, 1], [2, 2]]);
    });
    it('should return an array of the winning minor diagonal', function(){
      game.move(0, 2);
      game.move(1, 0);
      game.move(1, 1);
      game.move(1, 2);
      game.move(2, 0);
      expect(game.winningCells(2, 0)).to.eql([[2, 0], [1, 1], [0, 2]]);
    });
  });
});

},{"../../app/models/Board":3,"../../app/models/Game":4,"../../app/models/Player":5}],10:[function(require,module,exports){
var expect = chai.expect;
var MenuController = require('../../app/controllers/MenuController');
var GameController = require('../../app/controllers/GameController');

module.exports = describe('Menu Controller', function(){
  var menu;
  beforeEach(function(){
    menu = new MenuController();
  })

  describe('properties', function(){
    it('should have a game controller instance property', function(){
      expect(menu.app instanceof GameController).to.be.true;
      expect(menu.app.game.board.size).to.equal(3);
      expect(menu.app.game.board.checkDiag()).to.be.false;
      menu.app.game.move(1, 1);
      expect(menu.app.game.board.get(1, 1)).to.equal('O');

    });
  });
  describe('methods', function(){
    it('should have a initialize method', function(){
      expect(menu.initialize).to.be.a('function');
    });
    it('should have a newGameHandler method', function(){
      expect(menu.newGameHandler).to.be.a('function');
    });
  });
});

},{"../../app/controllers/GameController":1,"../../app/controllers/MenuController":2}],11:[function(require,module,exports){
var expect = chai.expect;
var Player = require('../../app/models/Player');

module.exports = describe('Player', function(){
  var player1, player2;
  beforeEach(function(){
    player1 = new Player('X');
    player2 = new Player('O');
  });

  describe('marker', function(){
    it('should have a marker property', function(){
      expect(player1.marker).to.be.a('string');
    });
    it('should return the correct marker value', function(){
      expect(player1.marker).to.equal('X');
      expect(player2.marker).to.equal('O');
    });
  });
});

},{"../../app/models/Player":5}]},{},[6]);
