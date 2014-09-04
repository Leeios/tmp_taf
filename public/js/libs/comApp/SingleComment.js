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
    this.comments = [];
    this.Schema = r.Comment;
    this.replyEl.onclick = this.addTmpComment.bind(this);
  },

  '+addTmpComment': function() {
    this.tmpComment.idFile = this.idFile;
    this.tmpComment.idParent = this.id;
    this.tmpComment.replyEl = '';
    this.tmpComment.actualTop = this.el.offsetHeight - 5;
  },

  '+displaySub': function() {
    this.fire('displayCol');
  }

});
return SingleComment;
});
