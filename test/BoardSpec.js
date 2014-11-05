var expect = chai.expect;

describe('Board', function(){
  var board;
  beforeEach(function(){
    board = new Board(3);
  })

  describe('size', function(){
    it('should return the size inputted', function(){
      expect(board.size).to.equal(3);
    })
  });
  describe('board instance', function(){
    it('should return an appropriately sized board array', function(){
      expect(Array.isArray(board.board)).to.be.true;
      expect(board.board.length).to.equal(3);
      expect(board.board[0].length).to.equal(3);
    });
    it('should return a board with all spaces set to null', function(){
      board.board.forEach(function(row) {
        row.forEach(function(cell) {
          expect(cell).to.be.null;
        });
      });
    });
  });
  describe('check board rows, columns and diagonals', function(){
    it('should return the state of a row', function(){
      board.board[0][0] = 'O';
      board.board[0][1] = 'O';
      board.board[0][2] = 'O';
      expect(board.checkRow(0)).to.be.true;
      expect(board.checkRow(1)).to.be.false;
      expect(board.checkRow(2)).to.be.false;
      board.board[0][1] = 'X';
      expect(board.checkRow(0)).to.be.false;
    });
    it('should return the correct state of a column', function(){
      board.board[0][1] = 'X';
      board.board[1][1] = 'X';
      board.board[2][1] = 'X';
      expect(board.checkCol(0)).to.be.false;
      expect(board.checkCol(1)).to.be.true;
      expect(board.checkCol(2)).to.be.false;
      board.board[2][1] = 'O';
      expect(board.checkCol(1)).to.be.false;
    });
    it('should return the correct state of diagonals', function(){
      board.board[0][0] = 'O';
      board.board[0][1] = 'O';
      board.board[0][2] = 'O';
      expect(board.checkDiag()).to.be.false;
      board.board[1][1] = 'O';
      board.board[2][2] = 'O';
      expect(board.checkDiag()).to.be.true;
      board.board[2][2] = 'X';
      expect(board.checkDiag()).to.be.false;
      board.board[2][0] = 'O';
      expect(board.checkDiag()).to.be.true;
    });
  });
})