var mongoose = require('mongoose'),
  cfg = require('config').Default;

var projSchema = new mongoose.Schema({
  uid: String,
  uidParent: String,
  name: String
});

var fileSchema = new mongoose.Schema({
  uid: String,
  uidParent: String,
  uidProject: String,
  name: String,
  size: Number,
  type: String,
  content: String,
});

var comSchema = new mongoose.Schema({
  uid: String,
  txt: String,
  uidFile: String,
  resolved: Boolean,
  author: String,
  actualTop: Number,
  replies: { type : Array , "default" : [] },
  areas: { type : Array , "default" : [] }
});

mongoose.model('Com', comSchema);
mongoose.model('File', fileSchema);
mongoose.model('Project', projSchema);
mongoose.connect(cfg.dbHost + '://' + cfg.dbUser + ':' + cfg.dbPwd + '@kahana.mongohq.com:' + cfg.dbPort + '/' + cfg.dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting database'));
db.once('open', function () {
  console.log('Connection to database: DONE');
});
