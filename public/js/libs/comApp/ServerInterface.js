sand.define('ServerInterface', [
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var ServerInterface = Seed.extend({
  '+options': {
    server: null,
    protocol: "none"
  },

  sendData: function(operation, data) {
    console.log("Send to server : ", operation, data);
    if (this.protocol == "socket") {
      this.server.emit(operation, data);
    } else {
      console.log("This protocol is not implemented yet");
    }
  }

});
return ServerInterface;
})
