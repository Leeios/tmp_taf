sand.define('Publisher', [], function(r) {

var Publisher = function() {
  this.map = {};
}

Publisher.prototype.fire = function(e) {
  if (!this.map[e]) {
    console.log('Fired event has no listener')
  } else {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    for (var i = 0, len = this.map[e].length; i < len; i++) {
      this.map[e][i].apply(this, args);
    }
  }
}

Publisher.prototype.on = function(e, callback) {
  if (!this.map[e]) {
    this.map[e] = [];
  }
  this.map[e].push(callback)
}

Publisher.extend = function (Class) {
  var C = function () {
    Publisher.call(this);
    Class.apply(this, arguments);
  }
  for (var i in Publisher.prototype) {
    C.prototype[i] = Publisher.prototype[i];
  }
  for (var i in Class.prototype) {
    C.prototype[i] = Class.prototype[i];
  }
  return C;
}

return Publisher;

});
