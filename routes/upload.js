var mongoose = require('mongoose');
var file_method = require('../model/file');

exports.upload = function(req, res) {
  file_method.getFile(req.url.substr(1), function(data) {
    res.render('index.jade', {locals: {file: data}});
  });
}
