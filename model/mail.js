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
  textMail[data.name] = {};
  textMail[data.name].projects = [];
  textMail[data.name].projects.push(data);
  textMail[data.name].files = [];
  textMail[data.name].comments = [];
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
  if (!textMail[username]) { return ;}
  data.change = s;
  textMail[username][data.type].push = data;
};

var _emitEmail = function(mailList, idProj, type, change) {
  var mailOptions = {
      from: 'Feedy.io <feedy.io@gmail.com>',
      to: mailList,
      subject: 'Feedy project ' + idProj + 'has been modified ✔',
      text: 'A ' + type + ' has been ' + change + ' on project ' + idProj,
      html: 'A ' + type + ' has been ' + change + ' on project ' + idProj
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
var formateMail = function(data) {
  console.log(data);
  return ;
  /*INIT MAIL*/
  var finalTxt = 'Hi ! User ' + username + ' reviewed project ';
  for ( var i = 0, len = textMail[username].projects.length; i < len; i++) {
    if (textMail[username].projects[i].id === idProject) {
      finalTxt += textMail[username].projects[i].name + ' / ' + textMail[username].projects[i].id + ' :\n\n';
    }
  }
  /*CONTENT*/
  for (var i = 0, len = textMail[username].projects.length; i < len; i++) {
    if (textMail[username].projects[i].idParent === idProject) {
      finalTxt += '\nProject version: ' + textMail[username].projects[i].name;
      for (var j = 0, lenj = textMail[username].files.length; j < lenj; j++) {
        if (textMail[username].files[j].idProject === textMail[username].projects[i].id && textMail[username].files[j].idParent == 0) {
          finalTxt += '\n  File name: ' + textMail[username].files[j].name;
          for (var k = 0, lenk = textMail[username].files.length; k < lenk; k++) {
            if (textMail[username].files[k].idParent === textMail[username].files[j].id) {
              finalTxt += '\n    File version: ' + textMail[username].files[j].name;
              for (var l = 0, lenl = textMail[username].comments.length; l < lenl; l++) {
                if (textMail[username].comments[l].idFile == textMail[username].files[k].id) {
                  finalTxt += '\n     |Comment ' + textMail[username].comments[l].change + ':\n' + textMail[username].comments[l].txt;
                }
              }
            }
          }
        }
      }
    }
  }
  console.log(textMail[username]);
};

exports.sendMail = function(idProject, username) {
  project_method.getProj(idProject, function(data) {
    data.username = username;
    formateMail(data);
  }, {id: 1, idParent: 1, idProject: 1, idFile: 1, name: 1});
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
