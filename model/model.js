var mongoose = require('mongoose'),
  cfg = require('config').Default;

var comSchema = new mongoose.Schema({
  comment: String,
  sText: String,
  author: String
});

mongoose.model('Com', comSchema);
mongoose.connect(dbHost + '://' + cfg.dbUser + ':' + cfg.dbPwd + '@kahana.mongohq.com:' + cfg.dbPort + '/' + cfg.dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting database'));
db.once('open', function () {
  console.log('Connection to database: DONE');
});
