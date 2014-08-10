sand.define('ServerInterface', [
  'Seed'
], function(r) {

var ServerInterface = Seed.extend({
  '+options': {
    server: null,
    protocol: "none"
  }
});

ServerInterface.prototype.sendData = function(operation, data) {
  if (this.protocol == "socket") {
    this.server.emit(operation, data);
  } else {
    console.log("This protocol is not implemented yet");
  }
};

  return ServerInterface;

})
