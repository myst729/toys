/**
 * front.js
 * Simple JavaScript template engine.
 *
 * Author: Leo Deng
 * URL:    https://github.com/myst729/front.js
 */

function front(templateString, sourceData, targetNode) {

  // ES5 strict mode
  "use strict";

  var dataArray = Array.isArray(sourceData) ? sourceData : [sourceData];  // Wrap source data for auto iteration.
  var htmlString = "";

  // Retrieve data in an object through the path.
  var retrieveSource = function(sourceObject, dataPath) {
    var keys = dataPath.split('.');
    var source = sourceObject;
    var key;
    // Drill down the path.
    while(keys.length) {
      key = keys.shift();
      if(typeof source === 'object' && key in source) {
        source = source[key];
      } else {
        // Path doesn't exist anymore.
        return null;
      }
    }
    return {content: source};
  };

  // Fill data into the template.
  dataArray.forEach(function(data) {
    // Deal with logic, get the logicless template to fill data.
    var template = templateString.replace(/@if\{\{([\w\s-_\.]+)\}\}([\s\S]+?)(@else([\s\S]+?))?@endif/g, function($, $1, $2, $3, $4) {
      // @if statement exists and equals to true, return content in @if block.
      // @if statement exists and equals to false, and @else statement exists, return content in @else block.
      // @if statement exists and equals to false, but @else statement doesn't exist, return empty string.
      return retrieveSource(data, $1) ? $2 : ($3 ? $4 : "");
    });

    // Fill data into template.
    htmlString += template.replace(/\{\{([\w\s-_\.]+)\}\}/g, function($, $1) {
      // Skip it if data object doesn't have that key.
      var sourceObj = retrieveSource(data, $1);
      return sourceObj ? sourceObj.content : $;
    });
  });

  // If target node is provided, append the HTML string to it. Otherwise return the HTML string.
  if(targetNode) {
    targetNode.innerHTML = htmlString;
  } else {
    return htmlString;
  }

}

// force.js module definition.
if(typeof define === "function" && define.amd) {
  define('front.js/front', [], function() {
    return { render: front };
  });
}