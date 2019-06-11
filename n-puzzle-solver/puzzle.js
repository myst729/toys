void function(window, document, undefined) {
  var DEFAULT_SIDE = 3;
  var CELL_SIZE = 92;
  var CELL_GAP = 10;

  var totalMoves = 0;

  // Constructor of the game
  function Puzzle(container) {
    this.board = container;
    this.side = DEFAULT_SIDE;
    this.total = this.side * this.side;
    this.hole = this.total - 1;
    this.cells = [];
    this.finger = {};

    this.init();
  }

  // Move target cell to the hole
  Puzzle.prototype.moveCell = function(target, playing) {
    var cell = document.getElementsByTagName("span")[this.cells[target] - 1];
    this.placeCell(cell, this.hole);

    this.cells[this.hole] = this.cells[target];
    this.cells[target] = 0;
    this.hole = target;

    totalMoves++;
    if(playing) {
      this.checkCells();
    }
  };

  // Place the cell to the right place on the board
  Puzzle.prototype.placeCell = function(cell, i) {
    cell.style.left = ((i % this.side) * (CELL_SIZE + CELL_GAP) + CELL_GAP) + "px";
    cell.style.top = (Math.floor(i / this.side) * (CELL_SIZE + CELL_GAP) + CELL_GAP) + "px";
  };

  // Generate cells and store initial values
  Puzzle.prototype.fillCells = function() {
    var fragment = document.createDocumentFragment();
    for(var i = 0; i < this.total - 1; i++) {
      var cell = document.createElement("span");
      cell.className = "cell";
      cell.innerHTML = i + 1;
      this.cells[i] = i + 1;
      this.placeCell(cell, i);
      fragment.appendChild(cell);
    }
    this.cells.push(0);
    this.goal = this.cells.slice();
    this.board.appendChild(fragment);
    this.board.className = "board";
    this.board.style.height = this.board.style.width = (this.side * (CELL_SIZE + CELL_GAP) + CELL_GAP) + "px";
  };

  Puzzle.prototype.resetCounter = function() {
    totalMoves = 0;
  };

  // For the win!
  Puzzle.prototype.checkCells = function() {
    if(this.goal.join() === this.cells.join()) {
      var self = this;
      setTimeout(function() {
        if(confirm("Congratulations! You made it in " + totalMoves + " moves.\nPlay again?")) {
          self.shuffleCells();
        }
        self.resetCounter();
      }, 100);
    }
  };

  // Randomly initiate the cells before game starts
  Puzzle.prototype.shuffleCells = function() {
    var i = 300;
    while(i--) {
      var direction = ["left", "up", "right", "down"][Math.floor(Math.random() * 4)];
      this.swapCells(direction);
    }
    this.resetCounter();
  };

  Puzzle.prototype.swapCells = function(direction, playing) {
    var target = -1;
    switch(direction) {
      case "left":
        if(this.hole % this.side < this.side - 1) {
          target = this.hole + 1;
        }
        break;
      case "up":
        if(this.hole < this.total - this.side) {
          target = this.hole + this.side;
        }
        break;
      case "right":
        if(this.hole % this.side > 0) {
          target = this.hole - 1;
        }
        break;
      case "down":
        if(this.hole > this.side - 1) {
          target = this.hole - this.side;
        }
        break;
    }

    if(target > -1) {
      this.moveCell(target, playing);
    }
  };

  // Apply the event listeners
  Puzzle.prototype.defineActions = function() {
    var self = this;
    self.board.addEventListener("click", function(e) {
      var target = e.target;
      if(target.tagName === "SPAN") {
        //TODO: handle mouse click or finger tap on cells, and call swapCells method
      }
    }, false);

    window.addEventListener("keyup", function(e) {
      // e.preventDefault();
      var direction = ["left", "up", "right", "down"][e.keyCode - 37];
      self.swapCells(direction, true);
    }, false);

    window.addEventListener("touchstart", function(e) {
      // e.preventDefault();
      self.finger.startX = e.touches[0].pageX;
      self.finger.startY = e.touches[0].pageY;
    }, false);

    window.addEventListener("touchmove", function(e) {
      e.preventDefault();
      self.finger.moving = true;
      self.finger.endX = e.touches[0].pageX;
      self.finger.endY = e.touches[0].pageY;
    }, false);

    window.addEventListener("touchend", function(e) {
      // e.preventDefault();
      if(!self.finger.moving) {
        return;
      }

      var offsetX = self.finger.startX - self.finger.endX;
      var offsetY = self.finger.startY - self.finger.endY;
      var direction;

      if(Math.abs(offsetX) < 20 && Math.abs(offsetY) < 20) {
        return;
      }

      if(Math.abs(offsetX) > Math.abs(offsetY)) {
        direction = offsetX > 0 ? "left" : "right";
      } else {
        direction = offsetY > 0 ? "up" : "down";
      }
      self.swapCells(direction, true);
      self.finger.startX = self.finger.startY = self.finger.endX = self.finger.endY = 0;
      self.finger.moving = false;
    }, false);
  };

  Puzzle.prototype.doActions = function(actions, delay) {
    if (actions.length === 0) {
      this.checkCells();
      return;
    }

    var self = this;
    var action = actions[0];
    var nextActions = actions.slice(1);

    self.swapCells(action);
    setTimeout(function() {
      self.doActions(nextActions, delay);
    }, delay || 0);
  };

  Puzzle.prototype.init = function() {
    this.fillCells();
    this.defineActions();
    this.shuffleCells();
  };

  window.Puzzle = Puzzle;
}(window, document);
