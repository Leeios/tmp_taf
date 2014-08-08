var mongoose = require('mongoose');
var model = require('./model');

exports.insertFile = function(data, callback) {
    var File = mongoose.model('File');
    var insert_file = new File({
      name: data.name,
      size: data.size,
      type: data.type,
      content: data.s
    });
    insert_file.save(function (err, doc) {
      if (err) {
        console.log("Cannot add file " + data.name + " to database");
      } else {
        console.log("File " + data.name + " added to database");
        callback(doc._id);
      }
  });
}
