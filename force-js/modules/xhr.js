define('modules/xhr', [], function() {

  var force = {

    'get': function(url, callback, errorback) {
      var xhrRequest = new XMLHttpRequest();
      xhrRequest.open('GET', url, true);
      xhrRequest.onreadystatechange = function() {
        if(xhrRequest.readyState == 4 && xhrRequest.status == 200) {
          responseData = JSON.parse(xhrRequest.responseText);
          callback(responseData);
        } else if(errorback) {
          errorback();
        }
      };
      xhrRequest.send(null);
    },

    'post': function(url, requestData, callback, errorback) {
      var xhrRequest = new XMLHttpRequest();
      xhrRequest.open('POST', url, true);
      xhrRequest.onreadystatechange = function() {
        if(xhrRequest.readyState == 4 && xhrRequest.status == 200) {
          responseData = JSON.parse(xhrRequest.responseText);
          callback(responseData);
        } else if(errorback) {
          errorback();
        }
      };
      xhrRequest.setRequestHeader('Content-length', request.length);
      xhrRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhrRequest.send(requestData);
    }

  };

  return force;

});