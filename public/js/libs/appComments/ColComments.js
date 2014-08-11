sand.define('ColComments', [
  'CommentsGroup',
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

  addArea: function(canArea) {
    this.addTmpComment();
    this.tmp.addArea(canArea);
    this.displaySub();
  },

  '-displaySub': function() {
    this.fire('clearCanvas');
  }

});
return ColComments;
});
