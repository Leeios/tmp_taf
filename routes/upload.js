exports.upload = function(req, res) {
  res.render('index.jade', {locals: {file: req.url.substr(1)}});
}
