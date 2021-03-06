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
