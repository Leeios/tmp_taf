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
    if (!this.tmpComment && this.Schema) {
      this.addTmpComment();
      this.tmpComment.on('displayCol', this.displaySub.bind(this));
    }
    this.tmpComment.addArea(canArea);
    this.displaySub();
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
