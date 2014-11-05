var expect = chai.expect;

describe('Player', function(){
  var player1, player2;
  beforeEach(function(){
    player1 = new Player('X');
    player2 = new Player('O');
  })

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
