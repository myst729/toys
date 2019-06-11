define('modules/dom', ['modules/query', 'modules/string'], function(query, string) {

  var force = {

    'byId': query['byId'],

    'byTag': query['byTag'],

    'byClass': query['byClass'],

    'hasClass': function(node, cls) {
      var filter = new RegExp("(^|\\s)" + cls + "(\\s|$)");
      return filter.test(string.lower(node.className));
    },

    'addClass': function(node, cls) {
      if(!this.hasClass(node, cls)) {
        node.className = string.trim((node.className + ' ' + cls).replace(/\s\s+/, ' '));
      }
      return node;
    },

    'removeClass': function(node, cls) {
      if(this.hasClass(node, cls)) {
        node.className = string.trim((' ' + node.className + ' ').replace(' ' + cls + ' ', ' ').replace(/\s\s+/, ' '));
      }
      return node;
    },

    'addStyle': function(node, stl) {
      Object.keys(stl).forEach(function(k) {
        node.style[k] = stl[k]
      })
    },

    'create': function(tag) {
      return document.createElement(tag)
    },

    'text': function(ele, text) {
      ele.textContent = text
    },

    'append': function(parent, child) {
      parent.appendChild(child)
    },

    appendAll: function(parent, children) {
      children.forEach(function (child) {
        force.append(parent, child)
      })
    }

  };

  return force;

});