sand.define('CommentsGroup', [
  'Comment',
  'Seed'
], function(r) {

/*
**Fire: 3
**On:   4
*/
var CommentsGroup = r.Seed.extend({

  tpl: {
    tag: '.main-comment'
  },

  options: {
    idFile: -1,
    tmpComment: null,
    comments: [],
    areas: []
  },

  addArea: function(canArea) {/*INTERFACE*/
    this.areas.push(canArea);
    this.mainComment.actualTop = canArea.points[canArea.points.length - 1][0];
    this.el.style.top = this.actualTop + "px";
  },

  displayArea: function() {
    for (var i = 0, len = this.areas.length; i < len; i++) {
      this.areas[i].draw();
    }
  },

  highStyle: function() {
    this.areas[0] && ((this.areas[0].ctx.strokeStyle =  this.color) && (this.areas[0].ctx.globalAlpha = 0.3));
    this.displayArea();
    this.areas[0] && (this.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.el.style["background-color"] = "#fefefe";
    this.fire('redraw');
    this.displayArea();
  },

  /*Use for import dataserv*/
  setAreas: function(data, ctx) {
    var current_area;
    for (var i = 0, len = data.length; i < len; i++) {
      current_area = this.create(r.CanvasArea, {points: data[i], ctx: ctx});
      this.areas.push(current_area);
    }
  }

  insertComment: function() {
    this.tmpComment.valid();
    this.comments.push(this.tmpComment);
    this.tmpComment = null;
  },

  addComment: function(data) {/*INTERFACE*/
    if (this.tmpComment !== null) {return ;}

    /*Create or setting comment*/
    if (this.data == 'undefined') {
      this.tmpComment = this.create(r.Comment, {});
      delete this.tmpComment.id;
      this.tmpComment.id = this.query('dp').comments.insert(this.tmpComment.getData()).id;
    } else {
      this.tmpComment = this.create(r.Comment, data);
    }
    this.tmpComment.onCreate = this.insertComment.bind(this);
    this.tmpComment.onRemove = this.deleteComment.bind(this);

    this.el.appendChild(this.tmpComment.el);
  },

  deleteComment: function(rmCom) {
    this.query('dp').comments.one(function(e){ return this.rmCom.id == e.id }.bind(this)).remove();
    for (var i = 0, len = this.comments.length; i < len; i++) {
      if (rmCom.id == this.comments[i].id) {
        this.comments[i].el.remove();
        this.comments.splice(i, 1);
        return ;
      }
    }
  },

  /*Use for import dataserv*/
  setComGroup: function(id, ctx) {
    this.ctx = ctx;
    this.idFile = id;
    var dpComments = this.query('dp').comments.where( function(e) { return this.idFile == e.idFile; }.bind(this));

    for (var i = 0, len = dpComments.length; i < len; i++) {
      if (dpComments[i].idParent != 0) { continue ; }
      this.addComment(dpComments[i]);
      this.tmpComment.setAreas(dpComments[i].areas, ctx);
      this.tmpComment.preValide();
      this.insertComment();
    }
    for (var i = 0, len = dpComments.length; i < len; i++) {
      var comParent = {};
      if (dpComments[i].idParent == 0 ||
        (comParent = this.comments.one(function(e) { return dpComments[i].idParent == e.id }.bind(this)))
          == null) { continue ; }
      comParent.addComment(dpComments[i]);
      comParent.tmpComment.preValide();
      comParent.insertComment(false);
    }
  }

});
return CommentsGroup;
});
