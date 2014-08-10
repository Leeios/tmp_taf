exports.upload = function(req, res) {
	res.render('index.jade', {file: req.url.substr(1)});
}
