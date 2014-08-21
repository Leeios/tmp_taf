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
    this.reply.addEventListener("click", this.replyEl.bind(this));
  },

  replyEl: function() {
    this.addTmpComment();
    this.displaySub();
  },

  '+addTmpComment': function() {
    this.tmp.uidParent = this.uid;
    this.tmp.elTxt.focus();
    this.tmp.reply.remove();
    this.tmp.reply = null;
    this.tmp.actualTop = this.el.offsetHeight;
    this.tmp.switchEdit();
  },

  addReplies: function(data) {
    if (typeof data == "undefined")
      return ;
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].uidParent == this.uid) {
        this.tmp = new this.Schema(data[i]);
        this.tmp.preValide();
        this.tmp.on("redraw", function() {
          this.displaySub();
        }.bind(this));
        this.addTmpComment();
        this.addComment();
      }
    }
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
