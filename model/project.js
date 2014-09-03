var mongoose = require('mongoose');
var model = require('./model');
var Project = mongoose.model('Project');
var File = mongoose.model('File');
var Com = mongoose.model('Com');


exports.insertProj = function(data) {
  var insert_proj = new Project({
    name: data.name,
    id: data.id,
    idParent: data.idParent
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
exports.getProj = function(id, callback) {
  var result = {};
  result.projects = [];
  result.files = [];
  result.comments = [];

  Project.findOne({id: id}, {}, function(err, motherOfProject) {/*Nom du projet*/
    if (err || motherOfProject === null) { console.log("Failed to find " + id + " in database"); }
    else {
      result.projects.push(motherOfProject);
      Project.find({idParent: id}, {}, function(err, data) {/*Versions du projet*/
        if (err) { console.log("Failed to find " + id + " in database"); }
        else {
          result.projects = result.projects.concat(data);
          var pending = 0;
          for (var i = 1, len = result.projects.length; i < len; i++) {
            File.find({idProject: result.projects[i].id}, {}, function(err, dataF) {/*Fichier associés aux versions*/
              if (err) { console.log("Failed to find in database"); }
              else {
                result.files = result.files.concat(dataF);
                if (dataF.length ==0) { callback(result); }
                for (var j = 0, len = dataF.length; j < len; j++) {
                  Com.find({idFile: dataF[j].id}, {}, function(err, dataC) {
                    if (err) { console.log("Failed to find com") }
                    else {result.comments = result.comments.concat(dataC); }
                    pending--;
                    if (pending === 0) { callback(result); }
                  });
                  pending++;
                }
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
