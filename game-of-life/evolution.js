/**
 * Conway's Game of Life
 * A "cellular automaton" zero-player mathematical game.
 *
 * Author: Leo Deng
 * URL:    https://github.com/myst729/game-of-life
 */

// Evolve the next generation of cells.
var onmessage = function(e) {
  var cells = e.data;
  var next = [];
  var neighbors;

  for(var i = 0, l = cells.length; i < l; i++) {
    next[i] = [];
    for(var j = 0, k = cells[i].length; j < k; j++) {
      if(i === 0 || j === 0 || i === l-1 || j === k-1) {
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

  postMessage(next);
};