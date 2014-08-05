sand.define('appComments', [
  'Comments/SelectText',
  'ReadUpload'
], function(r) {
var appComments = function() {
  this.sText = new r.SelectText();
  this.rUpload = new r.ReadUpload();
}
return appComments;
});

//LAUNCHER
sand.require('appComments', function(r){
  //Socket co
  socket = io.connect();

  //Start comments app
  app = new r.appComments();
});
