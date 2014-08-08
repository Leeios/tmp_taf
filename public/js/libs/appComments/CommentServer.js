sand.define('CommentServer', [
  'Publisher'
], function(r) {

var CommentServer = function() {

  this.server = socket;
  this.protocol = "socket";
  this.model = "";
  this.receiveID();
}

CommentServer.prototype.sendData = function(operation, data) {
  this.model = data.model;
  if (this.protocol == "socket") {
    this.server.emit(operation, data);
  } else {
    console.log("This protocol is not implemented yet");
  }
};

CommentServer.prototype.receiveID = function() {
  this.server.on('id', function(id) {
    this.fire('id' + this.model, id);
  }.bind(this));
}

  CommentServer = r.Publisher.extend(CommentServer);
  return CommentServer;

})
