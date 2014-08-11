var mongoose = require('mongoose');
var file_method = require('../model/file');

exports.upload = function(req, res) {
  console.log("go");
  file_method.getFile(req.url.substr(1), function(data) {
    res.render('index.jade', {locals: {file: data}});
  });
}
