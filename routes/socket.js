var idUser = 0;
var proj_method = require('../model/project');
var file_method = require('../model/file');
var com_method = require('../model/comment');

exports.socket = function(socket) {

  /*Basic enter and msg*/
  socket.username = idUser.toString();
  console.log('User ' + idUser + ' connected');
  var address = socket.handshake.address;
  console.log("New connection from " + address.address + ":" + address.port);
  socket.on('msg', function (message) {
    console.log('Client ' + socket.username + ' send :', message);
  });

  socket.on('insert', function (data) {
    if (data.type == 'projects') {
      proj_method.insertProj(data.models);
    } else if (data.type == 'files') {
      file_method.insertFile(data.models);
    } else if (data.type == 'comments') {
      com_method.insertCom(data.models);
    } else {
      console.log('Data model is not recognized');
    }
  });

  socket.on('edit', function (data) {
    if (data.type == 'comments') {
      com_method.editCom(data.models);
    } else {
      console.log('Data model is not recognized');
    }
  });

  socket.on('remove', function (data) {
    if (data.type == 'comments') {
      com_method.deleteCom(data.models);
    } else {
      console.log('Data model is not recognized');
    }
  });
}
