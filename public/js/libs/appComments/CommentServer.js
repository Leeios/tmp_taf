sand.define('CommentServer', [
], function(r) {

var CommentServer = function() {

  this.server = socket;
  this.protocol = "socket";
}

CommentServer.prototype.sendData = function(type, data) {
  if (this.protocol == "socket") {
    this.server.emit(type, data);
  } else {
    console.log("This protocol is not implemented yet");
  }
};

  return CommentServer;

})
