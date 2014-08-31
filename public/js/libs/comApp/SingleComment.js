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
    this.reply.addEventListener("click", this.replyEl.bind(this));
  },

  replyEl: function() {
    this.preInsertComment();
    this.displaySub();
  },

  '+preInsertComment': function() {
    this.tmpComment.uidParent = this.uid;
    this.tmpComment.elTxt.focus();
    this.tmpComment.reply.remove();
    this.tmpComment.reply = null;
    this.tmpComment.actualTop = this.el.offsetHeight - 5;
    this.tmpComment.switchEdit();
  },

  addReplies: function(data) {
    if (typeof data == "undefined")
      return ;
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].uidParent == this.uid) {
        this.tmpComment = new this.Schema(data[i]);
        this.tmpComment.preValide();
        this.tmpComment.on("redraw", function() {
          this.displaySub();
        }.bind(this));
        this.preInsertComment();
      }
    }
  }

});
return SingleComment;
});
