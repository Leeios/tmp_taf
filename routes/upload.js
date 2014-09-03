var mongoose = require('mongoose');
var proj_method = require('../model/project');

exports.upload = function(req, res) {
  proj_method.getProj(req.url.substr(1), function(data) {
    console.log(data);
    res.render('index.jade', {locals: {proj: data}});
  });
}
