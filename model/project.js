var mongoose = require('mongoose');
var model = require('./model');
var Project = mongoose.model('Project');
var File = mongoose.model('File');
var Com = mongoose.model('Com');


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

/*Attention les yeux, callbacks de la mort*/
exports.getProj = function(uid, callback) {
  var result = {};

  Project.findOne({uid: uid}, {}, function(err, motherOfProject) {/*Nom du projet*/
    if (err) { console.log("Failed to find " + uid + " in database"); }
    else {
      result.name = motherOfProject.name;
      Project.find({uidParent: uid}, {}, function(err, data) {/*Versions du projet*/
        if (err) { console.log("Failed to find " + uid + " in database"); }
        else {
          result.versions = data.slice(0);
          result.files = [];
          result.comments = [];
          var pending = 0;
          for (var i = 0, len = result.versions.length; i < len; i++) {
            File.find({uidProject: result.versions[i].uid}, {}, function(err, dataF) {/*Fichier associés aux versions*/
              if (err) { console.log("Failed to find in database"); }
              else {
                for (var j = 0, len = dataF.length; j < len; j++) {
                  Com.find({uidFile: dataF[j].uid}, {}, function(err, dataC) {
                    if (err) { console.log("Failed to find com") }
                    else { result.comments.push(dataC); }
                    pending--;
                    if (pending === 0) { callback(result); }
                  });
                  pending++;
                }
                result.files.push(dataF);
                pending--;
              }
            });
            pending++;
          }
        }
      });
    }
  });
};
