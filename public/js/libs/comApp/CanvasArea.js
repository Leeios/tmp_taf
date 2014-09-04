sand.define('CanvasArea', [
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var CanvasArea = r.Seed.extend({

  '+options': {
    pos: [],
    points: [],
    form: "empty",
    ctx: null
  },

  '+init': function() {
    this.points = this.points.slice(0);
  },

  refresh: function(pos) {
    this.pos = pos.slice(0);
    this.points.push(this.pos);
    this.drawCurrent();
  },

  clone: function() {
    var copy = new CanvasArea({points: this.points, form: this.form, ctx: this.ctx});
    return (copy);
  },

  /*Draw functions*/
  draw: function () {
    if (!this.points[0]) { return ; }
    this.runPath();
  },

  runPath: function() {
    if (!this.points[0]) { return ; }
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0][0], this.points[0][1]);
    for (var i = 1, len = this.points.length; i < len; i++) {
      this.ctx.lineTo(this.points[i][0], this.points[i][1]);
    }
    this.ctx.stroke();
  },

  drawCurrent: function() {
    var len = this.points.length - 1;
    if (len < 2) { return ; }
    this.ctx.beginPath();
    this.ctx.lineTo(this.points[len - 1][0], this.points[len - 1][1]);
    this.ctx.lineTo(this.points[len][0], this.points[len][1]);
    this.ctx.stroke();
  },

  getArea: function() {
    return (this.points);
  }

});
return CanvasArea;
});
