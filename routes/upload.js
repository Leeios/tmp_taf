var mongoose = require('mongoose');
var proj_method = require('../model/project');

exports.upload = function(req, res) {
	console.log('Searching data to send');
  proj_method.getProj(req.url.substr(1), function(data) {
    console.log('Send data to client');
    res.render('index.jade', {locals: {proj: data}});
  });
}
