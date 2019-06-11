/**
 * A* pathfinding algorithm
 * https://github.com/myst729/a-star-pathfinding
 */

function aStarSearch(from, to, worldMap) {
  var ORTHOGONAL = 10
  var DIAGONAL = 14
  var height = worldMap.length
  var width = worldMap[0].length
  var openList = []

  // Get a node's children.
  function getChildren(parent) {
    var children = []
    var walkables = {}
    var neighbor

    // LEFT
    if(parent.x > 0) {
      neighbor = worldMap[parent.y][parent.x - 1]
      // If a neighbor is (1) walkable, (2) not closed and (3) has lower cost through current node,
      // set current node as its parent and recalculate its cost, manhattan and estimated values.
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + ORTHOGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
      walkables.left = neighbor.walkable
    }

    // RIGHT
    if(parent.x < width - 1) {
      neighbor = worldMap[parent.y][parent.x + 1]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + ORTHOGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
      walkables.right = neighbor.walkable
    }

    // UP
    if(parent.y > 0) {
      neighbor = worldMap[parent.y - 1][parent.x]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + ORTHOGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
      walkables.up = neighbor.walkable
    }

    // DOWN
    if(parent.y < height - 1) {
      neighbor = worldMap[parent.y + 1][parent.x]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + ORTHOGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + ORTHOGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
      walkables.down = neighbor.walkable
    }

    // UPLEFT
    // Do not consider upleft neighbor if both up neighbor and left neighbor are not walkable.
    if((walkables.up || walkables.left) && (parent.x > 0 && parent.y > 0)) {
      neighbor = worldMap[parent.y - 1][parent.x - 1]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + DIAGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + DIAGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
    }

    // UPRIGHT
    if((walkables.up || walkables.right) && (parent.x < width - 1 && parent.y > 0)) {
      neighbor = worldMap[parent.y - 1][parent.x + 1]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + DIAGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + DIAGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
    }

    // DOWNLEFT
    if((walkables.down || walkables.left) && (parent.x > 0 && parent.y < height - 1)) {
      neighbor = worldMap[parent.y + 1][parent.x - 1]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + DIAGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + DIAGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
    }

    // DOWNRIGHT
    if((walkables.down || walkables.right) && (parent.x < width - 1 && parent.y < height - 1)) {
      neighbor = worldMap[parent.y + 1][parent.x + 1]
      if(neighbor.walkable && !neighbor.closed && neighbor.cost > parent.cost + DIAGONAL) {
        neighbor.parent = parent
        neighbor.cost = parent.cost + DIAGONAL
        neighbor.manhattan = ORTHOGONAL * (Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y))
        neighbor.estimated = neighbor.cost + neighbor.manhattan
        children.push(neighbor)
      }
    }

    return children
  }

  // Reinitialize
  for(var h = 0; h < height; h++) {
    for(var w = 0; w < width; w++) {
      worldMap[h][w].cost = Infinity
      worldMap[h][w].open = false
      worldMap[h][w].closed = false
      worldMap[h][w].parent = null
    }
  }
  from.cost = 0
  from.open = true
  openList.push(from)

  // Search while open list is not empty.
  while(openList.length) {
    // Pick the one with lowest estimated value from open list.
    var current = openList.sort(function(a, b) { return b.estimated - a.estimated }).pop()
    var children = getChildren(current)

    current.closed = true

    for(var i = 0, l = children.length; i < l; i++) {
      // Destination reached!
      if(children[i].manhattan === 0) {
        var step = children[i].parent
        var path = []

        // Haven't got back to starting point yet.
        while(step.cost !== 0) {
          path.push(step)
          step = step.parent
        }

        return path.reverse()
      }

      // If the child is not in open list, put it in.
      if(!children[i].open) {
        children[i].open = true
        openList.push(children[i])
      }
    }
  }

  // Cannot find a path.
  return null
}
