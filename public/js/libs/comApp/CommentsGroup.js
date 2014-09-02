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

  insertComment: function() {
    this.tmpComment.valid();
    this.comments.push(this.tmpComment);
    this.query('dp').comments.insert(this.tmpComment.getData(this.idFile));

    this.comments.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.tmpComment = null;
    this.displaySub();
  },

  addTmpComment: function() {
    this.tmpComment = this.create(this.Schema, { txt: 'Enter a comment ...',
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
        // this.query('dp').comments.one(function(e){ return this.comments[i].id == e.id }).remove();
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
      i > 0 && (previous_down = parseInt(this.comments[i - 1].el.style.top) + this.comments[i - 1].getHeight())
      && (previous_down >= parseInt(this.comments[i].el.style.top))
      && (this.comments[i].el.style.top = previous_down + 'px');
      this.comments[i].displayArea();
    }
  },

  /*Use for import dataserv*/
  setComGroup: function(id, ctx) {
    this.idFile = id;
    this.comments = this.query('dp').comments.where( function(e) { return this.id === e.idFile; }.bind(this));
    for (var i = 0, len = this.comments.length; i < len; i++) {
      if (this.comments[i].idParent == -1) {
        this.tmpComment = this.create(this.Schema, this.comments[i]);
        this.tmpComment.setAreas(this.comments[i].areas, ctx);
        this.tmpComment.preValide();
        this.insertComment(this.comments);
      }
    }
  }

});
return CommentsGroup;
});
