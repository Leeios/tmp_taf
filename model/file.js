var mongoose = require('mongoose');
var model = require('./model');

exports.insertFile = function(data) {
    var File = mongoose.model('File');
    var insert_file = new File({
      uid: data.uid,
      name: data.name,
      size: data.size,
      type: data.type,
      content: data.s
    });
    insert_file.save(function (err) {
      if (err) {
        console.log("Cannot add file " + data.name + " to database");
      } else {
        console.log("File " + data.name + " added to database");
      }
  });
}
