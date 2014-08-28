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
var Inheritance = r.CommentsGroup.extend(r.Comment.prototype);
var SingleComment = Inheritance.extend({

  '+init': function() {
    // Seed.prototype.init.apply(this, arguments);
    // r.CommentsGroup.prototype['+init'].apply(this, arguments);
    // r.Comment.prototype['+init'].apply(this, arguments);
    this.schema = r.Comment;
  }

});
return SingleComment;
});
