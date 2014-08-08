var idUser = 0;
var mongoose = require('mongoose');
var file_method = require('../model/file');

exports.socket = function(socket) {

  socket.username = idUser.toString();
  console.log('User ' + idUser++ + ' connected');
  var address = socket.handshake.address;
  console.log("New connection from " + address.address + ":" + address.port);
  socket.on('msg', function (message) {
    console.log('Client ' + socket.username + ' send :', message);
  });
  socket.on('file', function (data) {
    //file_method.insertFile(data);
  });
  socket.on('comment', function (message) {
    console.log('Client ' + socket.username + ' send :', message);
  });
}
