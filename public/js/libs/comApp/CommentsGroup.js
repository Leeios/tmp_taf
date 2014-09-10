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
            onCreate: this.onCreate.bind(this),
            onRemove: function() {this.onRemove(this.mainId); this.removeGroup();}.bind(this),
            onReply: this.addReply.bind(this)
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
      onCreate: function() {console.log('create is not available on this element')},
      onRemove: function() {console.log('remove not available on this element');}
    }
  },

  addArea: function(canvasArea) {/*INTERFACE*/
    this.main.areas.push(canvasArea);
    this.actualTop = canvasArea.points[canvasArea.points.length - 1][0];
    this.query('dp').comments.one(function(e) { return this.main.id === e.id }.bind(this))
          .edit({'areas': this.main.getAreas(), 'actualTop': this.main.actualTop});
    this.el.style.top = this.actualTop + "px";
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

  addReply: function(data) {/*INTERFACE*/
    if (this.tmpReply !== null) {return ;}

    this.tmpReply = this.create(r.Comment, {
            idFile: this.idFile,
            color: this.color,
            onCreate: this.createReply.bind(this),
            onRemove: this.removeReply.bind(this),
            onReply: this.addReply.bind(this)
          });
    this.el.appendChild(this.tmpReply.el);
  },

  createReply: function() {
    this.tmpReply.valid();
    this.replies.push(this.tmpReply);
    this.tmpReply = null;
  },

  removeReply: function(id) {
    for (var i = 0, len = this.replies.length; i < len; i++) {
      if (id == this.replies.id) {
        this.replies.splice(i, 1);
        return ;
      }
    }
  }

});
return CommentsGroup;
});
