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
    this.tmpComment.idParent = this.id;
    this.tmpComment.replyEl = '';
    this.tmpComment.actualTop = this.el.offsetHeight - 5;
  },

  addReplies: function() {
    this.replies = this.query('dp').comments.where( function(e) { return this.id === e.idParent; }.bind(this));
    for (var i = 0, len = replies.length; i < len; i++) {
      this.tmpComment = new this.Schema(replies[i]);
      this.tmpComment.preValide();
      this.tmpComment.on("redraw", function() {
        this.displaySub();
      }.bind(this));
      this.preInsertComment();
    }
  },

  '+displaySub': function() {
    this.fire('displayCol');
  }

});
return SingleComment;
});
