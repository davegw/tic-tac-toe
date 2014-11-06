var expect = chai.expect;

describe('Application Controller', function(){
  var app;
  beforeEach(function(){
    app = new ApplicationController(3);
  });

  describe('properties', function(){
    it('should have a game instance property', function(){
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
    customApp = new ApplicationController(6, 4);
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
