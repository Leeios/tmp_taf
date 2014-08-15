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

  '-options': function() {
    return {
      Schema: r.Comment
    };
  },

  '-displaySub': function() {
  },

  '-formate': function() {
    var formateSinCom = {};

    formateSinCom.comment = this.formateEl();
    formateSinCom.replies = this.formateAll();

    return formateSinCom;
  }

});
return SingleComment;
});
