sand.define('ColComments', [
  'CommentsGroup',
  'MainComment',
  'DOM/toDOM'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var ColComments = r.Seed.extend({
  tpl: {
    tag: ".col-comments"
  },

  '-options': {
    dp: null,
    commentList: [],
    tmpGroup: null
  },

  addArea: function(canArea) {/*INTERFACE*/
    if (!this.tmpGroup) {
      this.tmpGroup = this.create(r.CommentsGroup, {idFile: this.idFile});
    }
    this.tmpGroup.addArea(canArea);
  },

  drawAreas: function() {
    this.fire('clearCanvas');
    for (var i = 0, len = this.comments.length; i < len; i++) {
      this.commentsList[i].drawAreas();
    }
  },

  resetCol: function(h) {
    this.el.innerHTML = '';
    this.tmpComment = null;
    this.commentsList = [];
    this.el.style.height = h + 'px';
  }

});
return ColComments;
});
