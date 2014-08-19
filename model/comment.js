var mongoose = require('mongoose');
var model = require ('./model');
var Com = mongoose.model('Com');
var File = mongoose.model('File');

exports.insertCom = function(data) {
  var insert_com = new Com({
    uid: data.data.uid,
    uidFile: data.uidFile,
    txt: data.data.txt,
    actualTop: data.data.actualTop,
    points: data.data.points,
    areas: data.data.areas
  });
  insert_com.save(function(err) {
    if (err) {
      console.log("Comment " + data.data.txt + " not added to database");
    } else {
      console.log("Comment added " + data.data.txt);
    }
  });
}

exports.deleteCom = function(data) {

  Com.findOneAndRemove({uid: data.data.uid}, {}, function(err) {
      if (err) { console.log("Error removing comment"); }
      else { console.log("Comment " + data.data.uid + " removed from database"); }
  });
}

exports.editCom = function(data) {

  Com.update({uid: data.data.uid}, {txt: data.data.txt}, function(err, doc) {
    if (err) { console.log("Failed to edit com"); }
    else { console.log("Comment edited"); }
  });
}
