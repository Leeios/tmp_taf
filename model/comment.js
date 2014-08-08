var mongoose = require('mongoose');
var model = require ('./model');
var Com = mongoose.model('Com');
var File = mongoose.model('File');

exports.insertCom = function(data, callback) {
  var insert_com = new Com({
    txt: data.txt,
    areas: data.areas
  });
  File.update({_id: data.file_id}, {$push: {comments: insert_com}}, function (err) {
    if (err) {
      console.log("File " + data.fileName + " unknown");
    } else {
      console.log("Comment added to file " + data.file_id);
      callback(insert_com._id);
    }
  });
}

exports.deleteCom = function(data) {

  File.findOne({_id: data.file_id}, function(err, doc) {
    if (err) { console.log("File " + data.fileName + " unknown"); }
    else {
      var com = doc.comments;
      for (var i = com.length; i--;) {
        if (com[i]._id.toString() === data.id) {
          com.splice(i, 1);
        }
      }
      doc.update({comments: com}, function(err) {
        if (err) { console.log("Comment not found"); }
        else { console.log("Comment removed in file " + data.file_id); }
      })
    }
  });
}

exports.editCom = function(data) {
  File.findOne({_id: data.file_id}, function(err, doc) {
    if (err) { console.log("File " + data.fileName + " unknown"); }
    else {
      var com = doc.comments;
      for (var i = com.length; i--;) {
        if (com[i]._id.toString() === data.id) {
          com[i].txt = data.txt;
        }
      }
      doc.update({comments: com}, function(err) {
        if (err) { console.log("Comment not found"); }
        else { console.log("Comment edited in file " + data.file_id); }
      })
    }
  });

}
