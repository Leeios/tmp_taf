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
        onCreate: function() {this.commentsList.push(this.tmpGroup); this.tmpGroup = null; this.displayComments();}.bind(this)
      });
      this.tmpGroup.on('redraw', this.drawAreas.bind(this), this);
      this.el.appendChild(this.tmpGroup.el);
    }
    this.tmpGroup.addArea(canArea);
    this.drawAreas();
    this.displayComments();
  },

  drawAreas: function() {
    this.fire('clearCanvas');
    this.tmpGroup && this.tmpGroup.drawAreas();
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].drawAreas();
    }
    this.displayComments();
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

  displayComments: function() {
    this.commentsList.sort(function (a, b) {
      return a.main.actualTop - b.main.actualTop;
    });
   var previous_down;
   if (this.tmpGroup !== null) { this.tmpGroup.el.style.top = this.tmpGroup.main.actualTop + 'px'; }
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].refreshDate();
       this.commentsList[i].el.style.top = this.commentsList[i].main.actualTop + 'px';
       i > 0 && (previous_down = parseInt(this.commentsList[i - 1].el.style.top) + this.commentsList[i - 1].el.offsetHeight)
       && (previous_down >= parseInt(this.commentsList[i].el.style.top))
       && (this.commentsList[i].el.style.top = previous_down + 'px');
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
      this.tmpGroup.setReplies(dpComments);
      this.el.appendChild(this.tmpGroup.el);
      this.commentsList.push(this.tmpGroup);
      this.tmpGroup = null;
    }
    this.drawAreas();
  }


});
return ColComments;
});
