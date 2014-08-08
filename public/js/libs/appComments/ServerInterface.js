sand.define('ServerInterface', [
  'Publisher'
], function(r) {

var ServerInterface = function() {

  this.server = socket;
  this.protocol = "socket";
}

ServerInterface.prototype.sendData = function(operation, data) {
  if (this.protocol == "socket") {
    this.server.emit(operation, data);
  } else {
    console.log("This protocol is not implemented yet");
  }
};

  ServerInterface = r.Publisher.extend(ServerInterface);
  return ServerInterface;

})
