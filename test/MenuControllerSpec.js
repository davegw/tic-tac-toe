var expect = chai.expect;

describe('Menu Controller', function(){
  var menu;
  beforeEach(function(){
    menu = new MenuController();
  })

  describe('properties', function(){
    it('should have an application controller instance property', function(){
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
    it('should have a buildBoard method', function(){
      expect(menu.restartHandler).to.be.a('function');
    });
    it('should have a cellClickHandler method', function(){
      expect(menu.newGameHandler).to.be.a('function');
    });
  });
});
