var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var cfg = require('config').Default;
var model = require('./model');
var Mail = mongoose.model('Mail');
var project_method = require('./project');
var textMail = {};


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: cfg.Mailuser + '@gmail.com',
        pass: cfg.Mailpass
    }
});

exports.insertMail = function(data) {

  project_method.getProj(data.idProject, function(dataProj) {
    textMail[data.name] = {};
    textMail[data.name][data.idProject] = dataProj;
  }, {_id: 0, id: 1, idParent: 1, idProject: 1, idFile: 1, name: 1});

  if (!data.mail || !(new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").test(data.mail)) || data.idProj == 0) {
    return ;
  }
  var insert_mail = new Mail({
    mail: data.mail,
    idProj: data.idProj,
    subscribes: data.subscribes,
  });
  insert_mail.save(function (err) {
    if (err) {
      console.log("Cannot add mail " + data.mail + " to database");
    } else {
      console.log("Mail " + data.mail + " for project " + data.idProj + ' with subscribes ' + data.subscribes + " added to database");
    }
  });
}

exports.addMailContent = function(s, data, username) {
  if (!textMail[username]) {
    console.log('Error: Username not register yet, changes wont be save\n');
    return ;
  }
  for (var i = 0, len = textMail[username][data.idProject][data.type].length; i < len; i++) {
    if ((textMail[username][data.idProject][data.type][i].id || textMail[username][data.idProject][data.type][i].models.id) === (data.id || data.models.id)) {
      textMail[username][data.idProject][data.type][i].changes= s;
      textMail[username][data.idProject][data.type][i].txt = data.models.txt;
      return ;
    }
  }
  data.models.changes = s;
  textMail[username][data.idProject][data.type].push(data.models);
};

var _emitEmail = function(mailList, idProj, type, changes) {
  var mailOptions = {
      from: 'Feedy.io <feedy.io@gmail.com>',
      to: mailList,
      subject: 'Feedy project ' + idProj + 'has been modified ✔',
      text: 'A ' + type + ' has been ' + changes + ' on project ' + idProj,
      html: 'A ' + type + ' has been ' + changes + ' on project ' + idProj
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent to ' + mailList + ': ' + info.response);
      }
  });
};


/*ProjId/ProjName
**ProjVersionId/ProjVersionName
**FileId/FileName
**FileVersionId/FileVersionName
**CommentId/CommentTxt
*/
var keepChanges = function(tree) {
  for (var i = 0, len = tree.files.length; i < len; i++) {
    for (var j = 0, lenj = tree.comments.length; j < lenj; j++) {
      if (tree.comments[j].changes && tree.comments[j].idFile === tree.files[i].id) {
        tree.files[i].changes = 'IFC';/*Intermed File Children*/
        break ;
      }
    }
  }
  for (var i = 0, len = tree.files.length; i < len; i++) {
    for (var j = 0, lenj = tree.files.length; j < lenj; j++) {
      if (tree.files[j].changes && tree.files[j].idParent === tree.files[i].id) {
        tree.files[i].changes = 'IFP';/*Intermed File Parent*/
        break ;
      }
    }
  }
  for (var i = 0, len = tree.projects.length; i < len; i++) {
    for (var j = 0, lenj = tree.files.length; j < lenj; j++) {
      if (tree.files[j].changes && tree.files[j].idProject === tree.projects[i].id) {
        tree.projects[i].changes = 'IPC';/*Intermed File Parent*/
        break ;
      }
    }
  }
}

var formateMail = function(idProject, username) {
  /*INIT MAIL*/
  var tree = textMail[username][idProject];
  keepChanges(tree);
  var finalTxt = 'Hi ! User ' + username + ' reviewed a project\n';
  for (var i = 0, len = tree.projects.length; i < len; i++) {
    if (tree.projects[i].idParent == 0) {
      finalTxt += tree.projects[i].name + '/' + tree.projects[i].id;
      break ;
    }
  }
  for (var i = 0, len = tree.projects.length; i < len; i++) {
    if (tree.projects[i].changes && tree.projects[i].id !== idProject) {
      finalTxt += '\n  |' + tree.projects[i].changes + '|Project version: ' + tree.projects[i].name;
      for (var j = 0, lenj = tree.files.length; j < lenj; j++) {
        if (tree.files[j].changes && tree.files[j].idProject === tree.projects[i].id && tree.files[j].idParent == 0) {
          finalTxt += '\n    |' + tree.files[j].changes + '|File name: ' + tree.files[j].name;
          for (var k = 0, lenk = tree.files.length; k < lenk; k++) {
            if (tree.files[k].changes && tree.files[k].idParent === tree.files[j].id) {
              finalTxt += '\n      |' + tree.files[k].changes + '|File version: ' + tree.files[k].name;
              for (var l = 0, lenl = tree.comments.length; l < lenl; l++) {
                if (tree.comments[l].changes && tree.comments[l].idFile === tree.files[k].id) {
                  finalTxt += '\n       |' + tree.comments[l].changes + ' comment: ' + tree.comments[l].txt;
                }
              }
            }
          }
        }
      }
    }
  }
  console.log(finalTxt);
};

exports.sendMail = function(idProject, username) {
  formateMail(idProject, username);
  return ;

  var searchbite = (data.type == 'projects' ? 0 : (data.type == 'files' ? 1 : (data.type == 'comments') ? 2 : 4));
  Mail.find({idProj: data.idProject}, {}, function (err, doc) {
    if (err) {console.log('Error sending email: ' + err)}
    else {
      var mailList = '';
      for (var i = 0, len = doc.length; i < len; i++) {
        if (doc[i].subscribes, doc[i].subscribes >> searchbite) {
          mailList += doc[i].mail + ', ';
        }
      }
      _emitEmail(mailList, data.idProject, data.type, s);
    }
  })
};
