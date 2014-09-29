var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var cfg = require('config').Default;
var model = require('./model');
var Mail = mongoose.model('Mail');
var Project = mongoose.model('Project');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: cfg.Mailuser + '@gmail.com',
        pass: cfg.Mailpass
    }
});

exports.insertMail = function(data) {
    if (data.idProj == 0) { return ;}
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


var _emitEmail = function(mailList, idProj, type, change) {
  var mailOptions = {
      from: 'Feedy.io <swingcastor@gmail.com>',
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

exports.sendMail = function(s, data) {
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
