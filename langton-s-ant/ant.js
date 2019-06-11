/**
 * Langton's Ant
 * A two-dimensional "Turing machine" with a very simple set of rules but complicated emergent behavior.
 *
 * Author: Leo Deng
 * URL:    https://github.com/myst729/ant
 */

void function(window, document, undefined) {

  // ES5 strict mode
  "use strict";

  var cells = [];             // color of cells in the world
  var evolve = false;         // state of evolution
  var height = 128;           // number of cells vertically
  var width = 200;            // number of cells horizontally
  var size = 4;               // width and height of a cell
  var gap = 1;                // space between each cell
  var interval = 1;           // time cost for evolution
  var direction;              // direction the ant is going to move: 0 for "right", 1 for "down", 2 for "left", 3 for "up".
  var position;               // current location the ant occupies
  var counter;                // evolution counter

  var start = document.getElementById('start');
  var stop = document.getElementById('stop');
  var step = document.getElementById('step');
  var reset = document.getElementById('reset');
  var world = document.getElementById('world');
  var context = world.getContext('2d');

  // Toggle action buttons' state
  var toogleState = function() {
    start.disabled = evolve;
    stop.disabled = !evolve;
    step.disabled = evolve;
  };

  // Highlight the ant and update counter.
  var drawAnt = function() {
    context.fillStyle = 'red';
    context.fillRect(position[0] * (size + gap) + gap, position[1] * (size + gap) + gap, size, size);

    // Update the counter.
    context.fillStyle = 'black';
    context.fillRect(1, 1, 139, 29);
    context.fillStyle = 'white';
    context.fillText('STEP: ' + counter, 15, 21);
    counter++;
  };

  // Flip current cell's color and draw it.
  var drawCell = function() {
    context.fillStyle = cells[position[0]][position[1]] = (cells[position[0]][position[1]] === 'white' ? 'black' : 'white');
    context.fillRect(position[0] * (size + gap) + gap, position[1] * (size + gap) + gap, size, size);
  };

  // Initialize the world with the ant at the start point.
  var initializeGame = function() {
    context.clearRect(0, 0, world.width, world.height);
    counter = 0;            // reset evolution counter
    direction = 3;          // go up by default
    position = [90, 32];   // a pretty good start point to see the entire evolution

    // Reset all cells' color.
    for(var i = 0; i < width; i++) {
      cells[i] = [];
      for(var j = 0; j < height; j++) {
        cells[i][j] = 'white';
      }
    }

    // Draw the start point.
    evolve = false;
    drawAnt();
  };

  // Evolve next step of the game.
  var evolveGame = function() {
    // Draw current cell.
    drawCell();

    // Move the ant and draw it.
    position[0] += Math.round(Math.cos(direction * Math.PI / 2));
    position[1] += Math.round(Math.sin(direction * Math.PI / 2));
    drawAnt();

    // Determine the new direction.
    if(cells[position[0]][position[1]] === 'white') {
      // At a white square, turn right.
      direction++;
    } else {
      // At a black square, turn left.
      direction--;
    }

    // Check whether the ant has reached edge of the world.
    if(position[0] < 0 || position[0] > width - 1 || position[1] < 0 || position[1] > height - 1) {
      stopGame();
      return;
    }

    if(evolve) {
      setTimeout(evolveGame, interval);
    }
  };

  // Start evolution continuously.
  var startGame = function() {
    evolve = true;
    toogleState();
    evolveGame();
  };

  // Stop evolution.
  var stopGame = function() {
    evolve = false;
    toogleState();
  };

  // Go one step.
  var stepGame = function() {
    evolve = false;
    evolveGame();
  };

  // Reset the world and the ant to the initial state.
  var resetGame = function() {
    stopGame();
    initializeGame();
  };

  // Initialize the whole scene.
  var init = function() {
    world.width = (size + gap) * width + gap;
    world.height = (size + gap) * height + gap;
    context.font = '18px Consolas';

    start.addEventListener('click', startGame, false);
    stop.addEventListener('click', stopGame, false);
    step.addEventListener('click', stepGame, false);
    reset.addEventListener('click', resetGame, false);

    initializeGame();
  };

  window.addEventListener('load', init, false);

}(window, document);