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
