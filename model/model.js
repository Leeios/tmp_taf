var mongoose = require('mongoose'),
  cfg = require('config').Default;

var comSchema = new mongoose.Schema({
  uid: String,
  txt: String,
  author: String,
  actualTop: Number,
  areas: { type : Array , "default" : [] }
});

var fileSchema = new mongoose.Schema({
  uid: String,
  name: String,
  size: Number,
  type: String,
  content: String,
  comments: { type : Array , "default" : [] }
});

mongoose.model('Com', comSchema);
mongoose.model('File', fileSchema);
mongoose.connect(cfg.dbHost + '://' + cfg.dbUser + ':' + cfg.dbPwd + '@kahana.mongohq.com:' + cfg.dbPort + '/' + cfg.dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting database'));
db.once('open', function () {
  console.log('Connection to database: DONE');
});
