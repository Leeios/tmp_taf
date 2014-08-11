sand.define('SingleComment', [
  'Comment',
  'CommentsGroup',
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var SingleComment = r.CommentsGroup.extend({
  '+init': function() {
    this.main = new r.Comment();
    this.reply.addEventListener('click', this.addTmpComment.bind(this));
  }

});
return SingleComment;
});
