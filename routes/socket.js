var idUser = 0;
var proj_method = require('../model/project');
var file_method = require('../model/file');
var com_method = require('../model/comment');
var mail_method = require('../model/mail');
var timeSave = {};

exports.socket = function(socket) {

  /*Basic enter and msg*/
  // socket.username = idUser.toString();
  console.log('User ' + idUser + ' connected');
  var address = socket.handshake.address;
  console.log("New connection from " + address);
  socket.on('msg', function (message) {
    console.log('Client ' + socket.username + ' send :', message);
  });

  socket.on('insert', function (data) {
    if (data.type == 'projects') {
      proj_method.insertProj(data.models, socket);
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
      com_method.editCom(data.models, data.changes);
    } else if (data.type == 'projects') {
      proj_method.editProj(data.models, data.changes);
    } else if (data.type == 'files') {
      file_method.editFile(data.models, data.changes);
    } else {
      console.log('Data model is not recognized');
    }
  });

  socket.on('remove', function (data) {
    if (data.type == 'comments') {
      com_method.deleteCom(data.models);
    } else if (data.type == 'files') {
      file_method.removeFile(data.models);
    } else {
      console.log('Data model is not recognized');
    }
  });

  var isAlive = function(username, idProject) {
    if (username === undefined) { return ;}
    if (timeSave[username][idProject]) { clearTimeout(timeSave[username][idProject]); }
    var timeLeft = 3 * 1000;
    console.log('Launch timeout');
    timeSave[username][idProject] = setTimeout(function() {
      console.log('User ' + username + ' left project ' + idProject + ': send mail');
      mail_method.sendMail(idProject, username);
    }, timeLeft);
  };

  ['insert', 'edit', 'remove'].forEach(function(s) {
    socket.on(s, function(data) {
      mail_method.addMailContent(s, data, socket.username || 'default');
      isAlive(socket.username, data.idProject);
      socket.broadcast.to(data.idProject).emit(s, data);
    });
  });

  socket.on('subscribe', function(data) {
    console.log(data.name, 'arrived on project', data.idProject);
    if (data.idProject == 0) { return ;}
    mail_method.insertMail(data);
    socket.username = data.name;
    socket.join(data.idProject);
    if (!timeSave[socket.username]) {
      timeSave[socket.username] = {};
    }
  });
}
