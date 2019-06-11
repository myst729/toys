/**
 * force.js
 * Simple AMD module loader.
 *
 * Author: Leo Deng
 * URL:    https://github.com/myst729/force.js
 */

void function(window, document, undefined) {

  // ES5 strict mode
  "use strict";

  var head = document.getElementsByTagName('head')[0];
  var modules = {};   // map of all registered modules
  var injects = {};   // map of all scripts that have been injected
  var callbacks = {}; // stores the callbacks sequence for future execution
  var anonymous = 0;  // anonymous modules counter

  // Append a script tag into the document head.
  function appendScript(path) {
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.async = 'true';
    node.src = path + '.js';
    head.appendChild(node);
  }

  // Inject a module.
  function injectModule(id) {
    // Avoid repeated injection.
    if(!injects[id]) {
      injects[id] = true;
      appendScript(id);
    }
  }

  // Register a module.
  function registerModule(id, dependencies, callback) {
    // Avoid repeated registration.
    if(!modules[id]) {
      // Register this module by executing the callback with all dependencies as arguments.
      // The callback should return an object with several methods.
      modules[id] = callback.apply(null, dependencies);
      // Remove the callback from sequence.
      delete(callbacks[id]);
    }

    // Iterate the callbacks sequence to see whether any callback meets the condition to run.
    loop: for(var key in callbacks) {
      var deps = [];
      // Iterate all dependencies of this callback.
      for(var i = 2, l = callbacks[key].length; i < l; i++) {
        // If all dependencies are registered, construct the callback arguments.
        // Otherwise skip to next callback in the sequence.
        if(modules[callbacks[key][i]]) {
          deps.push(modules[callbacks[key][i]]);
        } else {
          continue loop;
        }
      }

      // Arguments are ready, execute the callback.
      if(callbacks[key][0]) {
        // Module definition, just register the module.
        registerModule(key, deps, callbacks[key][1]);
      } else {
        // Require modules in order to execute a callback.
        callbacks[key][1].apply(null, deps);
        // Remove the callback from sequence.
        delete(callbacks[key]);
      }
    }
  }

  /**
   * @description Define a module that can be used later.
   * @param {String} moduleId Absolute path to the module file (without file name extension).
   * @param {Array} dependencies IDs of the dependent modules.
   * @param {Function} factory A factory function that would be executed after all modules are ready, and returns definition of the module. Its parameter list must be coincident with the dependencies.
   */
  function defineModule(id, dependencies, callback) {
    // Check whether all dependencies are registered.
    for(var i = 0, l = dependencies.length; i < l; i++) {
      if(!modules[dependencies[i]]) {
        // If any dependency is not registered, store the callback and dependencies for future execution.
        callbacks[id] = [true, callback].concat(dependencies);

        // Try to inject all dependencies again and return.
        for(i = 0; i < l; i++) {
          injectModule(dependencies[i]);
        }
        return;
      }
    }

    // Register this module only if all dependencies are registered.
    registerModule(id, dependencies, callback);
  }

  /**
   * @description Require dependency modules and do something immediately.
   * @param {Array} dependencies IDs of the dependent modules.
   * @param {Function} factory A callback function that would be executed after all modules are ready. Its parameter list must be coincident with the dependencies.
   */
  function requireModule(dependencies, callback) {
    // Check whether all dependencies are registered.
    for(var i = 0, l = dependencies.length; i < l; i++) {
      if(!modules[dependencies[i]]) {
        // If any dependency is not registered, store the callback and dependencies for future execution.
        var id = 'require/' + (anonymous++);
        callbacks[id] = [false, callback].concat(dependencies);

        // Inject all dependencies and return.
        for(i = 0; i < l; i++) {
          injectModule(dependencies[i]);
        }
        return;
      }
    }

    // Execute the callback only if all dependencies are registered.
    callback();
  }

  // Initialize.
  function init() {
    // Compatible with AMD API
    defineModule.amd = {};

    // Expose define and require method to the window object.
    window.define = defineModule;
    window.require = requireModule;

    // Load app script.
    var app = document.getElementsByTagName('script')[0].getAttribute('data-main');
    appendScript(app);
  }

  // Go!
  init();

}(window, document);