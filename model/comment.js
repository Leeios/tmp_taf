var mongoose = require('mongoose');
var model = require ('./model');
var Com = mongoose.model('Com');
var File = mongoose.model('File');

exports.insertCom = function(data) {
  var insert_com = new Com({
    uid: data.uid,
    txt: data.txt,
    actualTop: data.actualTop,
    points: data.points,
    areas: data.areas
  });
  File.update({uid: data.file_uid}, {$push: {comments: insert_com}}, function (err) {
    if (err) {
      console.log("File " + data.fileName + " unknown");
    } else {
      console.log("Comment added to file " + data.file_uid);
    }
  });
}

exports.deleteCom = function(data) {

  File.findOne({uid: data.file_uid}, function(err, doc) {
    if (err) { console.log("File " + data.fileName + " unknown"); }
    else {
      var com = doc.comments;
      for (var i = com.length; i--;) {
        if (com[i].uid === data.uid) {
          com.splice(i, 1);
        }
      }
      doc.update({comments: com}, function(err) {
        if (err) { console.log("Comment not found"); }
        else { console.log("Comment removed in file " + data.file_uid); }
      })
    }
  });
}

exports.editCom = function(data) {
  File.findOne({uid: data.file_uid}, function(err, doc) {
    if (err) { console.log("File " + data.fileName + " unknown"); }
    else {
      var com = doc.comments;
      for (var i = com.length; i--;) {
        if (com[i].uid === data.uid) {
          com[i].txt = data.txt;
        }
      }
      doc.update({comments: com}, function(err) {
        if (err) { console.log("Comment not found"); }
        else { console.log("Comment edited in file " + data.file_uid); }
      })
    }
  });

}
