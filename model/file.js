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
      type: data.type,
    });
    insert_file.save(function (err) {
      if (err) {
        console.log("Cannot add file " + data.name + " to database");
      } else {
        console.log("File " + data.name + " added to database");
      }
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
