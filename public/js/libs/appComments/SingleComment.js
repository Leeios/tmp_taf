sand.define('SingleComment', [
  'Comment',
  'CommentsGroup',
  'DOM/toDOM',
  'Seed'
], function(r) {

var SingleComment = r.CommentsGroup.extend({
  '+init': function() {
    this.main = new r.Comment();
  }
});

return SingleComment;
});
