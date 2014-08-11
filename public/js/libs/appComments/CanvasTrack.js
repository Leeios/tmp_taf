sand.define('CanvasTrack', [
  'DOM/toDOM',
  'Seed',
  'CanvasArea'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var CanvasTrack = Seed.extend({
  tpl: {
    tag: "canvas.canWindow",
    attr : {
      height: 0,
      width: 0
    }
  },

  '+options': {
    pos: [],
    form: "empty"
  },

  '+init': function (options) {
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

  clearCanvas: function() {
    this.setSize(this.el.height, this.el.width);
  },

  /*Start/Save & Valid selection*/
  start: function (e) {
    var rect = this.el.getBoundingClientRect();
    this.pos[0] = e.clientX - rect.left;
    this.pos[1] = e.clientY - rect.top;
    this.canvasArea = new r.CanvasArea({pos: this.pos, form: this.form, ctx: this.ctx});
    this.mouseMoveHandler = this.draw.bind(this);
    this.mouseUpHandler = this.valid.bind(this);
    this.el.addEventListener('mousemove', this.mouseMoveHandler);
    this.el.addEventListener('mouseup', this.mouseUpHandler);
  },

  draw: function(e) {
    var rect = this.el.getBoundingClientRect();
    this.pos[0] = e.clientX - rect.left;
    this.pos[1] = e.clientY - rect.top;
    this.canvasArea.refresh(this.pos);
  },

  valid: function(e) {
    this.el.removeEventListener('mousemove', this.mouseMoveHandler);
    this.el.removeEventListener('mouseup', this.mouseUpHandler);
    this.canvasArea.previous = this.canvasArea.clone();
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
