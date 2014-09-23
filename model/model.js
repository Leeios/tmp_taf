var mongoose = require('mongoose'),
  cfg = require('config').Default;

var projSchema = new mongoose.Schema({
  id: String,
  idParent: String,
  name: String
});

var fileSchema = new mongoose.Schema({
  id: String,
  idParent: String,
  idProject: String,
  name: String,
  size: Number,
  type: String,
  content: String,
});

var comSchema = new mongoose.Schema({
  id: String,
  txt: String,
  idFile: String,
  idParent: String,
  date: Number,
  resolved: Boolean,
  author: String,
  actualTop: Number,
  color: String,
  areas: Array
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
