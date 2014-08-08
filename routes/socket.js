var idUser = 0;
var file_method = require('../model/file');
var com_method = require('../model/comment');

exports.socket = function(socket) {

  socket.username = idUser.toString();
  console.log('User ' + idUser++ + ' connected');
  var address = socket.handshake.address;
  console.log("New connection from " + address.address + ":" + address.port);
  socket.on('msg', function (message) {
    console.log('Client ' + socket.username + ' send :', message);
  });

  var callback = function(id) {
    socket.emit('id', id);
  }

  socket.on('add', function (data) {
    if (data.model == 'File') {
      file_method.insertFile(data, callback);
    } else if (data.model == 'Com') {
      com_method.insertCom(data, callback);
    } else {
      console.log('Data model is not recognized');
    }
  });

  socket.on('edit', function (data) {
    if (data.model == 'Com') {
      com_method.editCom(data);
    } else {
      console.log('Data model is not recognized');
    }
  });

  socket.on('delete', function (data) {
    if (data.model == 'Com') {
      com_method.deleteCom(data);
    } else {
      console.log('Data model is not recognized');
    }
  });
}
