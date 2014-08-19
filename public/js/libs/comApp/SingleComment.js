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
var Inheritance = function() {
  var P = {};
  for (var i in r.Comment.prototype) {
    P[i] = r.Comment.prototype[i];
  }
  delete(P.init);
  return r.CommentsGroup.extend(P);
}();

var SingleComment = Inheritance.extend({

  '+init': function() {
    this.sub = [];
    this.Schema = r.Comment;
    this.reply.addEventListener('click', function() {
      this.fire('replyEl');
    }.bind(this));
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
