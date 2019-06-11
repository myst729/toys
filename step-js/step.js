function Step() {
  this._state = Step.PENDING;
  this.nextStep = null;
  this.onResolved = function _onResolved() {};
  this.onRejected = function _onRejected() {};
}

Step.PENDING = 0;
Step.RESOLVED = 1;
Step.REJECTED = 2;

Step.isStep = function(obj) {
  return !!obj && typeof obj.then === "function";
};

Step.prototype.isPending = function() {
  return this._state === Step.PENDING;
};

Step.prototype.isResolved = function() {
  return this._state === Step.RESOLVED;
};

Step.prototype.isRejected = function() {
  return this._state === Step.REJECTED;
};

Step.prototype.resolve = function() {
  if(this.isPending()) {
    this._state = Step.RESOLVED;
    this.onResolved.apply(this, arguments);
  }
};

Step.prototype.reject = function() {
  if(this.isPending()) {
    this._state = Step.REJECTED;
    this.onRejected.apply(this, arguments);
  }
};

Step.prototype.then = function(onResolved, onRejected) {
  this.nextStep = new Step();
  this.onResolved = (typeof onResolved === "function" ? onResolved : this.onResolved).bind(this);
  this.onRejected = (typeof onRejected === "function" ? onRejected : this.onRejected).bind(this);
  return this.nextStep;
};

Step.prototype.when = function() {
  var step = this;
  var results = [];
  var requests = Array.prototype.slice.call(arguments);
  var expected = requests.length;
  var returned = 0;

  var checkResults = function(pos) {
    returned++;
    if(returned > expected) {
      return;
    }

    results[pos] = Array.prototype.slice.call(arguments, 1);
    if(this._state === Step.REJECTED) {
      step.reject.apply(step, results[pos]);
      return;
    }
    if(returned === expected) {
      var args = [];
      for(var j = 0; j < expected; j++) {
        args = args.concat(results[j]);
      }
      step.resolve.apply(step, args);
    }
  };

  for(var i = 0; i < expected; i++) {
    requests[i].onResolved = requests[i].onRejected = checkResults.bind(requests[i], i);
  }

  return step;
};
