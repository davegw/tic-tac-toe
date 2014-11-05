var expect = chai.expect;

describe('Application Controller', function(){
  var app;
  beforeEach(function(){
    app = new ApplicationController(3);
  })

  describe('properties', function(){
    it('should have a game instance property', function(){
      expect(app.game.board.size).to.equal(3);
      expect(app.game.board.checkDiag()).to.be.false;
      app.game.move(1, 1);
      expect(app.game.board.get(1, 1)).to.equal('X');

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
  });
});
