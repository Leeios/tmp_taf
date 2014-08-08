var mongoose = require('mongoose');

exports.insertFile = function(data) {
    var File = mongoose.model('File');
    var insert_file = new File({
      content: data
    });
    insert_file.save(function (err) {
      if (err) { console.log("Cannot add file to database"); }
      else { console.log("File added to database"); }
    })
}
