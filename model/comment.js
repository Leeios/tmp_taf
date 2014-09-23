var mongoose = require('mongoose');
var model = require ('./model');
var Com = mongoose.model('Com');
var File = mongoose.model('File');

exports.insertCom = function(data) {
  var insert_com = new Com({
    id: data.id,
    idFile: data.idFile,
    idParent: data.idParent,
    date: data.date,
    txt: data.txt,
    author: data.author,
    actualTop: data.actualTop,
    areas: data.areas,
    color: data.color
  });
  insert_com.save(function(err) {
    if (err) {
      console.log("Comment " + data.txt + " not added to database: " + err);
    } else {
      console.log("Comment added " + data.txt);
    }
  });
}

exports.deleteCom = function(data) {

  Com.findOneAndRemove({id: data.id}, {}, function(err) {
      if (err) { console.log("Error removing comment"); }
      else { console.log("Comment " + data.id + " removed from database"); }
  });
}

exports.editCom = function(data, changes) {
  Com.update({id: data.id}, {$set: changes}, function(err, doc) {
    if (err) { console.log("Failed to edit com"); }
    else { console.log("Comment edited"); }
  });
}
