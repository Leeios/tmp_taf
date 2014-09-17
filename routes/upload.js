var mongoose = require('mongoose');
var cfg = require('config').Default;
var proj_method = require('../model/project');

exports.upload = function(req, res) {
	console.log('Searching data to send', req.url.substr(1));
  proj_method.getProj(req.url.substr(1), function(data) {
    console.log('Send data to client');
    res.render('index.jade', {locals: {proj: data}, host: cfg.Host, port: cfg.Port});
  });
}
