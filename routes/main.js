var cfg = require('config').Default;

exports.main = function(req, res) {
	res.render('index.jade', {locals: {proj: null}, host: cfg.Host, port: cfg.Port});
}
