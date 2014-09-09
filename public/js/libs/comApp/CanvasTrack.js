sand.define('CanvasTrack', [
  'DOM/toDOM',
  'Seed',
  'CanvasArea'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var CanvasTrack = r.Seed.extend({
  tpl: {
    tag: "canvas.canWindow",
  },

  '+options': {
    pos: [],
    form: "empty"
  },

  '+init': function () {
    this.ctx = this.el.getContext("2d");
    this.el.addEventListener('mousedown', this.start.bind(this));
    this.el.addEventListener('mouseout', this.reset.bind(this));
  },

  /*Init/Clear*/
  setSize: function(h, w) {
    this.el.height = h;
    this.el.width = w;
    this.ctx.strokeStyle = "rgba(200, 200, 200, 0.3)";
    this.ctx.lineWidth = 15;
    this.ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
  },

  getCtx: function() {
    return (this.ctx);
  },

  clearCanvas: function() {
    this.setSize(this.el.height, this.el.width);
  },

  /*Start/Save & Valid selection*/
  start: function (e) {
    this.canvasArea = this.create(r.CanvasArea, {pos: this.getPosition(e), form: this.form, ctx: this.ctx});
    this.mouseMoveHandler = this.draw.bind(this);
    this.mouseUpHandler = this.valid.bind(this);
    this.el.addEventListener('mousemove', this.mouseMoveHandler);
    this.el.addEventListener('mouseup', this.mouseUpHandler);
  },

  draw: function(e) {
    this.canvasArea.refresh(this.getPosition(e));
  },

  getPosition: function(e) {
    var rect = this.el.getBoundingClientRect();
    return ([e.clientX - rect.left, e.clientY - rect.top])
  },

  valid: function(e) {
    this.el.removeEventListener('mousemove', this.mouseMoveHandler);
    this.el.removeEventListener('mouseup', this.mouseUpHandler);
    this.fire('valid', this.canvasArea);
  },

  /*When outmap*/
  reset: function() {
    this.el.removeEventListener('mousemove', this.mouseMoveHandler);
    this.el.removeEventListener('mouseup', this.mouseUpHandler);
    this.pos = [];
  }

});
return CanvasTrack;
});
