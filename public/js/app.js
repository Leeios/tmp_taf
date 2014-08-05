sand.define('appComments', [
  'Comments/SelectText',
  'Comments/CommentsCol'
], function(r) {
var appComments = function() {
  this.sText = new r.SelectText();
}
return appComments;
});

//LAUNCHER
sand.require('appComments', function(r){
  //Socket co
  socket = io.connect();
  //File dropping
  var zone = new FileDrop('upload', null);
  zone.event('send', function (files) {
    files.each(function (file) {
      console.log("File loaded");
    })
  });

  //Start comments app
  app = new r.appComments();
});
