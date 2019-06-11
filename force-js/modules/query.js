define('modules/query', [], function() {

  var force = {

    'byId': function(id, root) {
      root = root || document;
      return root.getElementById(id);
    },

    'byTag': function(tag, root) {
      var nodes, list, i, l;
      root = root || document;
      nodes = root.getElementsByTagName(tag);
      list = [];
      for(i = 0, l = nodes.length; i < l; i++) {
        list.push(nodes[i]);
      }
      return list;
    },

    'byClass': function(cls, root) {
      var nodes, list, i, l, filter;
      root = root || document;
      nodes = root.getElementsByTagName('*');
      list = [];
      filter = new RegExp("(^|\\s)" + cls + "(\\s|$)");
      for(i = 0, l = nodes.length; i < l; i++) {
        if(filter.test(nodes[i].className.toLowerCase())) {
          list.push(nodes[i]);
        }
      }
      return list;
    }

  };

  return force;

});