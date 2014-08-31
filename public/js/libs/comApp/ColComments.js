sand.define('ColComments', [
  'CommentsGroup',
  'SingleComment',
  'DOM/toDOM'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var ColComments = r.CommentsGroup.extend({
  tpl: {
    tag: "div.commentsGroup"
  },

  '+init': function() {
    this.Schema = r.SingleComment;
  },

  addArea: function(canArea) {
    this.addTmpComment();
    this.tmp.addArea(canArea);
    this.displaySub();
  },

  addReplies: function(data) {
    for (var i = 0, len = this.sub.length; i < len; i++) {
      this.sub[i].addReplies(data);
    }
  },

  resetCol: function() {
    this.el = '';
    this.sub = [];
  },

  '-displaySub': function() {
    this.fire('clearCanvas');
  }

});
return ColComments;
});
