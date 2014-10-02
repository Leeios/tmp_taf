var mongoose = require('mongoose');
var model = require('./model');
var Project = mongoose.model('Project');
var File = mongoose.model('File');
var Com = mongoose.model('Com');


exports.insertProj = function(data, socket) {
  var insert_proj = new Project({
    name: data.name,
    id: data.id,
    idParent: data.idParent
  });
  insert_proj.save(function(err) {
    if (err) {
      console.log("Failed to add " + data.name + " to database");
    } else {
      socket.emit('InsertProj', data.id);
      console.log("Proj " + data.name + " added to database");
    }
  });
};

exports.editProj = function(models, changes) {
  Project.update({id: models.id}, {name: changes.name}, function(err, data) {
    if (err) {console.log('Error editing Project name');}
    else {console.log('Project has been edited as', changes.name)}
    })
};

/*Attention les yeux, callbacks de la mort*/
exports.getProj = function(id, callback, getField) {
  var field = getField || {};
  var result = {};
  result.projects = [];
  result.files = [];
  result.comments = [];


  Project.findOne({id: id}, field, function(err, motherOfProject) {/*Nom du projet*/
    if (err || motherOfProject === null) { console.log("Failed to find " + id + " in database"); callback(null); }
    else {
      result.projects.push(motherOfProject);
      Project.find({idParent: id}, field, function(err, data) {/*Versions du projet*/
        if (err) { console.log("Failed to find " + id + " in database"); }
        else {
          result.projects = result.projects.concat(data);
          var pending = 0;
          for (var i = 1, len = result.projects.length; i < len; i++) {
            File.find({idProject: result.projects[i].id}, field, function(err, dataF) {/*Fichier associés aux versions*/
              if (err) { console.log("Failed to find in database"); }
              else {/*Com ruler*/
                result.files = result.files.concat(dataF);
                if (dataF.length !== 0) {
                  for (var j = 0, jen = dataF.length; j < jen; j++) {
                    Com.find({idFile: dataF[j].id}, field, function(err, dataC) {
                      if (err) { console.log("Failed to find com") }
                      else {result.comments = result.comments.concat(dataC); }
                      pending--;
                      if (pending === 0) { callback(result); pending = 100;}
                    });
                    pending++;
                  }
                }
                pending--;
                if (pending === 0) { callback(result); pending = 100;}
              }/*Com ruler*/
            });
            pending++;
          }
        }
      });
    }
  });
};
