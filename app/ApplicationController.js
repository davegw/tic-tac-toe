(function() {
  var ApplicationController = function(size) {
    this.game = new Game(size);
    this.statusEl = document.getElementById('status');
    this.boardEl = document.getElementById('board');
    this.initialize();
  };

  ApplicationController.prototype = {
    initialize: function() {
      this.buildBoard();
    },

    // Build the game board view.
    buildBoard: function() {
      if (!this.boardEl) {
        return 'No board element';
      }

      // Build an array of cell DOM elements to add to onresize listener.
      var cells = [];
      this.game.board._board.forEach(function(row, rowIdx) {
        // Create and append row class div to the board div for each row.
        var rowElement = document.createElement('div');
        rowElement.className = 'row';
        this.boardEl.appendChild(rowElement);

        row.forEach(function(_col, colIdx) {
          // Create and append cell class div to each column in each row.
          var cell = document.createElement('div');
          cell.className = 'cell';
          rowElement.appendChild(cell);

          // Create a marker class div and append to the above cell class div.
          var marker = document.createElement('div');
          marker.className = 'marker';
          cell.appendChild(marker);

          // Add a click handler to each cell for handling game flow and logic.
          cell.onclick = function() {
            this.cellClickHandler(rowIdx, colIdx, cell);
          }.bind(this);

          cells.push(cell);

        }.bind(this));
      }.bind(this));

      // Resize the board dimensions whenever the window is resized.
      window.onresize = function() {
        this.resizeBoard(cells);
      }.bind(this);

      // Set the initial board size.
      this.resizeBoard(cells);
    },

    // Handles cell click events by updating game model, view and status.
    cellClickHandler: function(row, col, cell) {
      // Check for game over or occupied scenario and do not take action if found.
      if (this.statusEl.className.match(/\bgame-over\b/)) {
        return;
      }
      if (cell.className.match(/\boccupied\b/)) {
        return this.statusEl.innerHTML = 'That space is already taken!';
      }

      // Clear status message.
      this.statusEl.innerHTML = '';

      // Process and display the move.
      this.game.move(row, col);
      this.printCell(row, col);

      // Check for game ending event and display status message if found.
      if (this.game.checkForWin(row, col)) {
        this.statusEl.className += ' game-over';
        return this.statusEl.innerHTML = 'Player ' + this.game.board.get(row, col) + ' wins!';
      }
      if (this.game.checkGameOver()) {
        this.statusEl.className += ' game-over';
        return this.statusEl.innerHTML = 'Tie!';
      }
    },

    // Resize board dimensions based on the window width.
    resizeBoard: function(cells) {
      // Calculate the cell width based on the board width and number of cells per row.
      // Subtract 1 to avoid rounding bug that cause cells to be wider than board.
      var cellSize = (this.boardEl.clientWidth - 1) / this.game.board.size;
      cells.forEach(function(cell) {
        cell.setAttribute("style", "width: " + cellSize + "px; height: " + cellSize + "px");
      });
    },

    // Render the cell at the inputted row and column.
    printCell: function(row, col) {
      var cell = document.getElementsByClassName('row')[row].children[col];
      cell.className += ' occupied';
      cell.children[0].innerHTML = this.game.board.get(row, col);
    }
  };

  new ApplicationController(9);
})();
