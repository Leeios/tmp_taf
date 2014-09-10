sand.define('CommentsGroup', [
  'Comment',
  'CanvasArea',
  'Seed'
], function(r) {

/*
**Fire: 3
**On:   4
*/
var CommentsGroup = r.Seed.extend({

  tpl: function() {
    return {
      tag: '.main-comment', children: [
        ['.wrap-comment', [
          this.create(r.Comment, {
            id: this.mainId,
            idFile: this.idFile,
            color: this.color,
            onRemove: function() {this.onDelete(); this.removeGroup();}.bind(this)
          }, 'main').el
        ]]
      ], events: {
        mouseover: this.highStyle.bind(this),
        mouseout: this.usualStyle.bind(this),
      }
    }
  },

  options: function() {
    return {
      mainId: 0,
      idFile: 0,
      tmpReply: null,
      actualTop: 0,
      replies: [],
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      onDelete: function() {console.log('delete not available on this element');}
    }
  },

  addArea: function(canvasArea) {/*INTERFACE*/
    this.main.areas.push(canvasArea);
    this.actualTop = canvasArea.points[canvasArea.points.length - 1][0];
    this.query('dp').comments.one(function(e) { return this.main.id === e.id }.bind(this))
          .edit({'areas': this.main.getAreas(), 'actualTop': this.main.actualTop});
    this.el.style.top = this.actualTop + "px";
    console.log(this.main.id, this.main.areas)
  },

  drawAreas: function() {
    for (var i = 0, len = this.main.areas.length; i < len; i++) {
      this.main.areas[i].draw();
    }
  },

  highStyle: function() {
    this.main.areas[0] && ((this.main.areas[0].ctx.strokeStyle =  this.color) && (this.main.areas[0].ctx.globalAlpha = 0.3));
    this.drawAreas();
    this.main.areas[0] && (this.main.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.fire('redraw');
  },

  setMain: function(data, ctx) {
    var current_area;
    for (var i = 0, len = data.areas.length; i < len; i++) {
      current_area = this.create(r.CanvasArea, {form: 'points', points: data.areas[i], ctx: ctx});
      this.main.areas.push(current_area);
    }
    this.main.txt = data.txt;
    this.main.preValide();
    this.main.valid();
  },

  removeGroup: function() {
    for (var i = 0, len = this.replies.length; i < len; i++) {
      this.replies[i].el.remove();
      this.query('dp').comments.one(function(e){ return this.replies[i].id == e.id }.bind(this)).remove();
    }
    this.main.el.remove();
    this.query('dp').comments.one(function(e){ return this.main.id == e.id }.bind(this)).remove();
  },

  insertComment: function() {
    this.tmpReply.valid();
    this.replies.push(this.tmpReply);
    this.tmpReply = null;
  },

  addComment: function(data) {/*INTERFACE*/
    if (this.tmpReply !== null) {return ;}

    /*Create or setting comment*/
    if (this.data == 'undefined') {
      this.tmpReply = this.create(r.Comment, {});
      delete this.tmpReply.id;
      this.tmpReply.id = this.query('dp').comments.insert(this.tmpReply.getData()).id;
    } else {
      this.tmpReply = this.create(r.Comment, data);
    }
    this.tmpReply.onCreate = this.insertComment.bind(this);
    this.tmpReply.onRemove = this.deleteComment.bind(this);

    this.el.appendChild(this.tmpReply.el);
  },

});
return CommentsGroup;
});
