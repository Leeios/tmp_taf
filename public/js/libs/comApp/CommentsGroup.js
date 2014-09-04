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
      delete this.tmpComment.id;
      this.tmpComment.id = this.query('dp').comments.insert(this.tmpComment.getData()).id;
    }
    this.comments.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.tmpComment = null;
    this.displaySub();
  },

  addTmpComment: function(data) {

    this.tmpComment = this.create(this.Schema, {
      id: typeof data == 'undefined' ? 0 : data.id,
      idParent: typeof data == 'undefined' ? 0 : data.idParent,
      idFile: typeof data == 'undefined' ? this.idFile : data.idFile,
      txt: typeof data == 'undefined' ? 'Enter a comment ...' : data.txt,
      actualTop: typeof data == 'undefined' ? 0 : data.actualTop,
      onCreate: this.insertComment.bind(this),
      onRemove: this.deleteComment.bind(this)
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
    var dpComments = this.query('dp').comments.where( function(e) { return this.idFile == e.idFile; }.bind(this));

      console.log(dpComments);
    for (var i = 0, len = dpComments.length; i < len; i++) {
      if (dpComments[i].idParent != 0) { continue ; }
      this.addTmpComment(dpComments[i]);
      this.tmpComment.setAreas(dpComments[i].areas, ctx);
      this.tmpComment.preValide();
      this.insertComment(false);
    }
    for (var i = 0, len = dpComments.length; i < len; i++) {/*idparent != 0 doesnt work ?*/
      var comParent = {};
      if (dpComments[i].idParent == 0 ||
        (comParent = this.comments.one(function(e) { return dpComments[i].idParent == e.id }.bind(this)))
          == null) { continue ; }
      comParent.addTmpComment(dpComments[i]);
      comParent.tmpComment.preValide();
      comParent.insertComment(false);
    }
  }

});
return CommentsGroup;
});
