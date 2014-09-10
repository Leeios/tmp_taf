sand.define('ColComments', [
  'CommentsGroup',
  'MainComment',
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var ColComments = r.Seed.extend({
  tpl: {
    tag: ".col-comments"
  },

  options: {
    dp: null,
    commentsList: [],
    tmpGroup: null
  },

  addArea: function(canArea) {/*INTERFACE*/
    if (!this.tmpGroup) {

      this.tmpGroup = this.create(r.CommentsGroup, {
        idFile: this.idFile,
        onRemove: this.deleteComGroup.bind(this),
        onCreate: function() {this.commentsList.push(this.tmpGroup); this.tmpGroup = null;}.bind(this)
      });
      this.tmpGroup.on('redraw', this.drawAreas.bind(this), this);
      this.el.appendChild(this.tmpGroup.el);
    }
    this.tmpGroup.addArea(canArea);
    this.drawAreas();
  },

  drawAreas: function() {
    this.fire('clearCanvas');
    this.tmpGroup && this.tmpGroup.drawAreas();
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].drawAreas();
    }
  },

  deleteComGroup: function(id) {
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      if (id == this.commentsList[i].mainId) {
        this.commentsList.splice(i, 1);
        this.drawAreas();
        return ;
      }
    }
  },

  resetCol: function(h) {
    this.el.innerHTML = '';
    this.tmpGroup = null;
    this.commentsList = [];
    this.el.style.height = h + 'px';
  },

  setComGroup: function(id, ctx) {
    this.ctx = ctx;
    this.idFile = id;
    var dpComments = this.query('dp').comments.where( function(e) { return this.idFile == e.idFile; }.bind(this));

    for (var i = 0, len = dpComments.length; i < len; i++) {
      if (dpComments[i].idParent != 0) { continue ; }
      this.tmpGroup = this.create(r.CommentsGroup, {
        mainId: dpComments[i].id,
        idFile: this.idFile,
        onRemove: this.deleteComGroup.bind(this),
      });
      this.tmpGroup.setMain(dpComments[i], ctx);
      this.tmpGroup.on('redraw', this.drawAreas.bind(this), this);
      // this.tmpGroup.addReplies();
      this.el.appendChild(this.tmpGroup.el);
      this.commentsList.push(this.tmpGroup);
      this.tmpGroup = null;
    }
    this.drawAreas();
    // for (var i = 0, len = dpComments.length; i < len; i++) {
    //   var comParent = {};
    //   if (dpComments[i].idParent == 0 ||
    //     (comParent = this.comments.one(function(e) { return dpComments[i].idParent == e.id }.bind(this)))
    //       == null) { continue ; }
    //   comParent.addComment(dpComments[i]);
    //   comParent.tmpComment.preValide();
    //   comParent.insertComment(false);
    // }
  }


});
return ColComments;
});
