/**
 * Conway's Game of Life
 * A "cellular automaton" zero-player mathematical game.
 *
 * Author: Leo Deng
 * URL:    https://github.com/myst729/game-of-life
 */

void function(window, document, undefined) {

  // ES5 strict mode
  "use strict";

  var cells = [];             // state of every cell
  var evolve = false;         // state of evolution
  var multithreading = false; // state of multithreading (web worker)
  var height = 120;           // number of cells vertically
  var width = 200;            // number of cells horizontally
  var size = 4;               // width and height of a cell
  var gap = 1;                // space between each cell
  var density = 0.2;          // density of random live cells
  var interval = 80;          // time cost for evolution

  var $height = document.getElementById('height');
  var $width = document.getElementById('width');
  var $size = document.getElementById('size');
  var $gap = document.getElementById('gap');
  var $density = document.getElementById('density');
  var $figure1 = document.getElementById('figure1');
  var $interval = document.getElementById('interval');
  var $figure2 = document.getElementById('figure2');
  var $multithreading = document.getElementById('multithreading');
  var $examples = document.getElementById('examples');
  var $new = document.getElementById('new');
  var $reset = document.getElementById('reset');
  var $random = document.getElementById('random');
  var $start = document.getElementById('start');
  var $stop = document.getElementById('stop');
  var $step = document.getElementById('step');
  var $clean = document.getElementById('clean');

  var $world = document.getElementById('world');
  var context = $world.getContext('2d');
  var worker;

  // Initialize all cells as dead.
  var initializeCells = function() {
    for(var i = 0; i < height + 2; i++) {
      cells[i] = [];
      for(var j = 0; j < width + 2; j++) {
        cells[i][j] = 0;
      }
    }
  };

  // Evolve the next generation of cells and draw them.
  var evolveCells = function() {
    if(multithreading) {
      // Use Worker to do the calculation.
      worker.postMessage(cells);
    } else {
      var next = [];
      var neighbors;

      for(var i = 0; i < height + 2; i++) {
        next[i] = [];
        for(var j = 0; j < width + 2; j++) {
          if(i === 0 || j === 0 || i === height+1 || j === width+1) {
            next[i][j] = 0; // shim cells
          } else {
            // Get the number of live neighbors (8 neighbors in total).
            neighbors = cells[i-1][j-1] + cells[i-1][j] + cells[i-1][j+1] + cells[i][j-1] + cells[i][j+1] + cells[i+1][j-1] + cells[i+1][j] + cells[i+1][j+1];

            if(cells[i][j] === 0 && neighbors === 3) {
              // Any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction.
              next[i][j] = 1;
            } else if(cells[i][j] === 1 && neighbors > 1 && neighbors < 4) {
              // Any live cell with 2 or 3 live neighbors lives on to the next generation.
              next[i][j] = 1;
            } else {
              // Live cell dies, caused by under-population (fewer than 2 live neighbors) or overcrowding (more than 3 live neighbors).
              // Dead cell remains dead.
              next[i][j] = 0;
            }
          }
        }
      }

      cells = next;
      placeCells();
    }
  };

  // Place the cells in the world.
  var placeCells = function() {
    context.clearRect(0, 0, (size + gap) * width - gap, (size + gap) * height - gap);

    for(var i = 1; i < height + 1; i++) {
      for(var j = 1; j < width + 1; j++) {
        if(cells[i][j] === 1) {
          context.fillRect((size + gap) * (j-1), (size + gap) * (i-1), size, size);
        }
      }
    }

    // Go on next generation.
    if(evolve) {
      setTimeout(evolveCells, interval);
    }
  };

  // Toggle form elements' state
  var toggleState = function() {
    $height.disabled = evolve;
    $width.disabled = evolve;
    $size.disabled = evolve;
    $gap.disabled = evolve;
    $density.disabled = evolve;
    $interval.disabled = evolve;
    $multithreading.disabled = !worker || evolve;
    $examples.disabled = evolve;
    $new.disabled = evolve;
    $reset.disabled = evolve;
    $random.disabled = evolve;
    $start.disabled = evolve;
    $stop.disabled = !evolve;
    $step.disabled = evolve;
    $clean.disabled = evolve;
  };

  // Generate initial cells with the name of this game.
  var initializeGame = function() {
    evolve = false;
    $examples.value = '1';
    presetGame();
    placeCells();
  };

  // Create new world with values from game setting pod.
  var newGame = function() {
    height = parseInt($height.value, 10);
    width = parseInt($width.value, 10);
    size = parseInt($size.value, 10);
    gap = parseInt($gap.value, 10);
    cleanGame();
  };

  // Retrieve all default values and reset the world.
  var resetGame = function() {
    $height.value = height = parseInt($height.initial, 10);
    $width.value = width = parseInt($width.initial, 10);
    $size.value = size = parseInt($size.initial, 10);
    $gap.value = gap = parseInt($gap.initial, 10);
    $density.value = density = parseFloat($density.initial);
    $figure1.innerHTML = density.toFixed(2);
    $interval.value = interval = parseInt($interval.initial, 10);
    $figure2.innerHTML = interval;
    cleanGame();
  };

  // Generate initial cells from examples.
  var presetGame = function() {
    evolve = false;
    initializeCells();

    // Initiate cells according to preset lifes.
    lifes[$examples.value].matrix.forEach(function(position) {
      var pos = position.split('|');
      cells[pos[0]][pos[1]] = 1;
    });

    placeCells();
  };

  // Generate random initial cells and draw them.
  var randomizeGame = function() {
    evolve = false;

    for(var i = 0; i < height + 2; i++) {
      cells[i] = [];
      for(var j = 0; j < width + 2; j++) {
        if(i === 0 || j === 0 || i === height+1 || j === width+1) {
          cells[i][j] = 0; // shim cells
        } else {
          cells[i][j] = (Math.random() < density) ? 1 : 0;
        }
      }
    }

    placeCells();
  };

  // Start evolution continuously.
  var startGame = function() {
    evolve = true;
    toggleState();
    evolveCells();
  };

  // Stop evolution.
  var stopGame = function() {
    evolve = false;
    toggleState();
  };

  // Spawn one generation.
  var stepGame = function() {
    evolve = false;
    evolveCells();
  };

  // Wipe all cells in the world.
  var cleanGame = function() {
    evolve = false;
    $examples.value = '0';
    initializeCells();
    $world.width = (size + gap) * width - gap;
    $world.height = (size + gap) * height - gap;
    context.fillStyle = '#f0f0f0';
    context.clearRect(0, 0, (size + gap) * width - gap, (size + gap) * height - gap);
  };

  // Impact cells during the game, and see how can we affect the evolution.
  var impactGame = function(e) {
    // Only do this when the world is paused.
    if(evolve) {
      return;
    }

    var offset = $world.getBoundingClientRect();
    var x = (e.clientX - offset.left) % (size + gap); // offsetX in a cell
    var y = (e.clientY - offset.top) % (size + gap);  // offsetY in a cell

    // Actually clicked on the cell rather than gap.
    if(x <= size && y <= size) {
      var i = Math.floor((e.clientY - offset.top) / (size + gap)) + 1;  // index X in the world
      var j = Math.floor((e.clientX - offset.left) / (size + gap)) + 1; // index Y in the world
      // Make dead lives, make live dies.
      cells[i][j] = 1 - cells[i][j];
      placeCells();
    }
  };

  // Initialize the game.
  var init = function() {
    // Generate example selector.
    var frag = document.createDocumentFragment();
    var opt;
    lifes.forEach(function(el, idx) {
      opt = document.createElement('option');
      opt.value = idx;
      opt.innerHTML = el.name;
      frag.appendChild(opt);
    });
    $examples.appendChild(frag);

    // Add all the dirty listeners.
    $density.addEventListener('change', function() {
      density = parseFloat($density.value);
      $figure1.innerHTML = density.toFixed(2);
    }, false);

    $interval.addEventListener('change', function() {
      interval = parseInt($interval.value, 10);
      $figure2.innerHTML = interval;
    }, false);

    $multithreading.addEventListener('change', function() {
      multithreading = $multithreading.checked;
    }, false);

    $new.addEventListener('click', newGame, false);
    $reset.addEventListener('click', resetGame, false);
    $examples.addEventListener('change', presetGame, false);
    $random.addEventListener('click', randomizeGame, false);
    $start.addEventListener('click', startGame, false);
    $stop.addEventListener('click', stopGame, false);
    $step.addEventListener('click', stepGame, false);
    $clean.addEventListener('click', cleanGame, false);
    $world.addEventListener('click', impactGame, false);

    // Set initial values.
    $height.value = $height.initial = height;
    $width.value = $width.initial = width;
    $size.value = $size.initial = size;
    $gap.value = $gap.initial = gap;
    $density.value = $density.initial = density;
    $figure1.innerHTML = density.toFixed(2);
    $interval.value = $interval.initial = interval;
    $figure2.innerHTML = interval;

    // Try to initialize a worker.
    try {
      worker = new Worker('evolution.js');
      worker.onmessage = function(e) {
        cells = e.data;
        placeCells();
      };
    } catch(ex) {
      $multithreading.disabled = true;
    }

    // Prepare the world.
    cleanGame();
    initializeGame();
  };

  window.addEventListener('load', init, false);

}(window, document);