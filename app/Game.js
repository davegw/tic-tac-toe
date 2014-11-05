var Game = function(size) {
  this.board = new Board(size);
  this.players = [new Player('X'), new Player('O')];
  this.currentPlayer = this.players[0];
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

  // Check if board contains all of same marker in row, column or diagonal. Returns true or false.
  checkForWin: function(row, col) {
    return this.board.checkRow(row) || this.board.checkCol(col) || this.board.checkDiag();
  },

  // Check if all cells have been filled. Returns true or false.
  checkGameOver: function() {
    return this.moves === this.board.size*this.board.size;
  }
};
