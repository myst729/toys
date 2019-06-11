function solve(puzzle, callback) {
  var side = puzzle.side;
  var goal = puzzle.goal;
  var initial = puzzle.cells.slice();
  var openList = [];
  var closeList = [];
  var hierarchy = {};

  function manhattan(currentIndex, goalIndex) {
    var currentX = currentIndex % side;
    var currentY = Math.floor(currentIndex / side);
    var goalX = goalIndex % side;
    var goalY = Math.floor(goalIndex / side);
    return Math.abs(currentX - goalX) + Math.abs(currentY - goalY);
  }

  function g(state) {
    var stated = state.join();
    return hierarchy[stated].moved;
  }

  function h(state) {
    var m = 0; // number of moves to made in manhattan distance
    for (var i = 0; i < goal.length - 1; i++) {
      var cellIndex = state.indexOf(goal[i]);
      if (cellIndex !== i) {
        m += manhattan(cellIndex, i);
      }
    }
    return m;
  }

  function f(state) {
    return g(state) + h(state);
  }

  function nextAttempt(currentState, holeIndex, cellIndex) {
    var nextState = currentState.slice();
    nextState[holeIndex] = nextState[cellIndex];
    nextState[cellIndex] = 0;
    return nextState;
  }

  function nextAttempts(state) {
    var holeIndex = state.indexOf(0);
    var holeX = Math.floor(holeIndex % side);
    var holeY = Math.floor(holeIndex / side);
    var nextStates = {directions: []};
    var nextState;

    if (holeX < side - 1) {
      // can swap left
      nextState = nextAttempt(state, holeIndex, holeIndex + 1);
      if (closeList.indexOf(nextState.join()) === -1) {
        nextStates.directions.push("left");
        nextStates.left = nextState;
      }
    }
    if (holeY < side - 1) {
      // can swap up
      nextState = nextAttempt(state, holeIndex, holeIndex + side);
      if (closeList.indexOf(nextState.join()) === -1) {
        nextStates.directions.push("up");
        nextStates.up = nextState;
      }
    }
    if (holeX > 0) {
      // can swap right
      nextState = nextAttempt(state, holeIndex, holeIndex - 1);
      if (closeList.indexOf(nextState.join()) === -1) {
        nextStates.directions.push("right");
        nextStates.right = nextState;
      }
    }
    if (holeY > 0) {
      // can swap down
      nextState = nextAttempt(state, holeIndex, holeIndex - side);
      if (closeList.indexOf(nextState.join()) === -1) {
        nextStates.directions.push("down");
        nextStates.down = nextState;
      }
    }

    return nextStates;
  }

  function open(state, previous, from) {
    var stated = state.join();
    if (closeList.indexOf(stated) === -1) {
      openList.push(state);
      hierarchy[stated] = {
        moved: previous ? hierarchy[previous].moved + 1 : 0,
        previous: previous || null,
        from: from || null
      };
    }
  }

  function search(state) {
    var stated = state.join();
    closeList.push(stated);

    if (stated === goal.join()) {
      // Solved!
      callback.call(puzzle, buildSteps(), 300);
      return;
    }

    var attempts = nextAttempts(state);
    var direction;
    for (var i = 0; i < attempts.directions.length; i++) {
      direction = attempts.directions[i];
      open(attempts[direction], stated, direction);
    }
    searchList();
  }

  function searchList() {
    openList.sort(function(a, b) {
      return f(b) - f(a);
    });
    setTimeout(function() {
      search(openList.pop());
    }, 0);
  }

  function buildSteps() {
    var currentState = hierarchy[goal.join()];
    var totalMoves = currentState.moved;
    var actions = [];

    while (currentState && currentState.previous) {
      actions.unshift(currentState.from);
      currentState = hierarchy[currentState.previous];
    }

    console.log(totalMoves, actions);
    return actions;
  }

  function start() {
    puzzle.resetCounter();
    open(initial);
    searchList();
  }

  start();
}
