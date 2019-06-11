define('modules/string', [], function() {

  var force = {

    'concat': function() {
      return String.prototype.concat.apply('', arguments);
    },

    'lower': function(input) {
      return input.toLowerCase();
    },

    'upper': function(input) {
      return input.toUpperCase();
    },

    'trim': function(input) {
      return input.replace(/^\s+/, '').replace(/\s+$/, '');
    }

  };

  return force;

});