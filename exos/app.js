sand.define('appComments', [
  'Comments/SelectText',
  'Comments/CommentsCol'
], function(r) {

var appComments = function() {
  this.sText = new r.SelectText();
}

return appComments;
});

sand.require('appComments', function(r){
  app = new r.appComments();
});
