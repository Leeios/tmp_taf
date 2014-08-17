var mongoose = require('mongoose');
var model = require('./model');
var Project = mongoose.model('Project');
var File = mongoose.model('File');


exports.insertProj = function(data) {
  var insert_proj = new Project({
    name: data.name,
    uid: data.uid,
    uidParent: data.uidParent
  });
  insert_proj.save(function(err) {
    if (err) {
      console.log("Failed to add " + data.name + " to database");
    } else {
      console.log("Proj " + data.name + " added to database");
    }
  });
};

exports.getProj = function(uid, callback) {

  Project.find({uidParent: uid}, {}, function(err, data) {
    if (err) { console.log("Failed to find " + uid + " to database"); }
    else {
      var result = data.slice(0);
      result.files = [];
      var pending = 0;
      for (var i = 0, len = result.length; i < len; i++) {
        File.find({uidProject: result[i].uid}, {}, function(err, dataF) {
          if (err) { console.log("Failed to find to database"); }
          else { result.files.push(dataF); }
          pending--;
          if (pending === 0) { callback(result); }
        });
        pending++;
      }
    }
  });
};
