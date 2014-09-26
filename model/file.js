var mongoose = require('mongoose');
var model = require('./model');
var File = mongoose.model('File');

exports.insertFile = function(data) {
    var insert_file = new File({
      id: data.id,
      idParent: data.idParent,
      idProject: data.idProject,
      name: data.name,
      content: data.content,
      size: data.size,
      type: data.type
    });
    insert_file.save(function (err) {
      if (err) {
        console.log("Cannot add file " + data.name + " to database");
      } else {
        console.log("File " + data.name + " added to database");
      }
  });
}

exports.editFile = function(models, changes) {
  File.update({id: models.id}, {name: changes.name}, function(err, data) {
    if (err) {console.log('Error editing File name');}
    else {console.log('File has been edited as', changes.name)}
    })
}

exports.removeFile = function(model) {
  File.remove({id: model.id}, function(err) {
    if (err) { console.log('Failed to remove file', model.name, model.id); }
    else { console.log('File', model.name, model.id, 'has been removed'); }
  });
}

exports.getFile = function(id, callback) {
  File.find({id: id}, {}, function (err, doc) {
      if (err || doc == null) {
        console.log("File " + id + " not found in database");
      } else {
        console.log("File " + id + " found in database");
      }
      callback(doc);
  });
}
