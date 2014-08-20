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

  '-addComment': function(data) {
    this.tmp.addReplies(data);
    this.tmp.on("add", function(el) {
      this.fire('add', el);
    }.bind(this));
  },

  '-displaySub': function() {
    this.fire('clearCanvas');
  },

  formate: function() {
    this.formateAll();
  }

});
return ColComments;
});
