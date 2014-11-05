var Board = function(size) {
  // Set default size to 3 if none entered.
  this.size = size || 3;

  // Prefill a size x size matrix with null values.
  this.board = Array.apply(null, Array(this.size)).map(function() {
    return Array.apply(null, Array(this.size)).map(function() {
      return null;
    });
  }.bind(this));
}

Board.prototype = {
  // Check if input row contains all of same marker. Returns true or false.
  checkRow: function(row) {
    if (row < 0 || row >= this.size) {
      throw new Error("Invalid row inputted at checkRow");
    }

    var marker = this.board[row][0];
    if (marker === null) {
      return false;
    }

    return this.board[row].every(function(cell) {
      return cell === marker;
    })
  },

  // Check if input column contains all of same marker. Returns true or false.
  checkCol: function(col) {
    if (col < 0 || col >= this.size) {
      throw new Error("Invalid column inputted at checkCol");
    }

    var marker = this.board[0][col];
    if (marker === null) {
      return false;
    }

    return this.board.every(function(row) {
      return row[col] === marker;
    })
  },

  // Check if diagonals contain all of same marker. Returns true or false.
  checkDiag: function() {
    var majorDiag = this.board[0][0];
    var minorDiag = this.board[0][this.size - 1];

    var checkMajorDiag = majorDiag !== null && this.board.every(function(row, idx) {
      return row[idx] === majorDiag;
    });
    var checkMinorDiag = minorDiag !== null && this.board.every(function(row, idx) {
      return row[this.size - 1 - idx] === minorDiag;
    }.bind(this));

    return checkMajorDiag || checkMinorDiag;
  }
}
