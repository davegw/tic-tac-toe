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
