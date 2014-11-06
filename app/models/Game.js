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
  }
};
