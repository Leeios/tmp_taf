sand.define('CommentsGroup', [
  'Seed'
], function(r) {

/*
**Fire: 3
**On:   4
*/
var CommentsGroup = r.Seed.extend({

  '+options': {
    idFile: -1,
    tmpComment: null,
    comments: []
  },

  insertComment: function(bool_dp) {
    this.tmpComment.valid();
    this.comments.push(this.tmpComment);
    if (bool_dp != false) {
      this.tmpComment.id = this.query('dp').comments.insert(this.tmpComment.getData()).id;
    }

    this.comments.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.tmpComment = null;
    this.displaySub();
  },

  addTmpComment: function() {
    this.tmpComment = this.create(this.Schema, {
      idFile: this.idFile,
      txt: 'Enter a comment ...',
      onCreate: this.insertComment.bind(this),
      onRemove: this.deleteComment.bind(this),
    });
    this.tmpComment.on('redraw', function() {
      this.fire('clearCanvas');
      for (var i = 0, len = this.comments.length; i < len; i++) {
        this.comments[i].displayArea();
      }
    }.bind(this));
    this.el.appendChild(this.tmpComment.el);
  },

  deleteComment: function(rmSub) {
    for (var i = 0, len = this.comments.length; i < len; i++) {
      if (rmSub == this.comments[i]) {
        this.query('dp').comments.one(function(e){ return this.comments[i].id == e.id }.bind(this)).remove();
        this.comments[i].el.remove();
        this.comments.splice(i, 1);
        this.displaySub();
        return ;
      }
    }
  },

  displaySub: function() {
    var previous_down;
    this.tmpComment && this.tmpComment.displayArea();
    for (var i = 0, len = this.comments.length; i < len; i++) {
      this.comments[i].el.style.top = this.comments[i].actualTop + 'px';

      if (i > 0 && (previous_down = parseInt(this.comments[i - 1].el.style.top) + this.comments[i - 1].getHeight())
        >= parseInt(this.comments[i].el.style.top)) {
        this.comments[i].el.style.top = previous_down + 'px';
        this.comments[i].displayArea();
      }
    }
  },

  /*Use for import dataserv*/
  setComGroup: function(id, ctx) {
    this.idFile = id;
    var dpComments = this.query('dp').comments.where( function(e) { return this.idFile === e.idFile; }.bind(this));
    for (var i = 0, len = dpComments.length; i < len; i++) {
      if (dpComments[i].idParent == 0) {
        this.tmpComment = this.create(this.Schema, dpComments[i]);
        this.tmpComment.setAreas(dpComments[i].areas, ctx);
        this.tmpComment.preValide();
        this.insertComment(false);
      }
    }
  }

});
return CommentsGroup;
});
