var MenuController = function() {
  this.app = new ApplicationController();
  this.restartButton = document.getElementById('restart');
  this.newGameButton = document.getElementById('new-game');
  this.initialize();
};

MenuController.prototype = {
  initialize: function() {
    if (this.restartButton) {
      this.restartButton.onclick = this.restartHandler.bind(this);
    }
    if (this.newGameButton) {
      this.newGameButton.onclick = this.newGameHandler.bind(this);
    }
  },

  // Handle restart click event by reloading an empty board with the same settings.
  restartHandler: function() {
    this.app.resetGame();
    this.app = new ApplicationController(
                    this.app.game.board.size, 
                    this.app.game.players.length);
  },

  // Handle restart click event by loading an empty board of the desired settings.
  newGameHandler: function() {
    this.app.resetGame();
    this.app = new ApplicationController(
                    +document.getElementById('game-size-selector').value,
                    +document.getElementById('game-players-selector').value);
  }
};
