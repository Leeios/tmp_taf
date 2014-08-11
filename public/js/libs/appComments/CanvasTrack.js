sand.define('CanvasTrack', [
  'DOM/toDOM',
  'Seed',
  'CanvasArea'
], function(r) {

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
    this.el.addEventListener('mousedown', this.startSelection.bind(this));
    this.el.addEventListener('mouseout', this.reset.bind(this));
  }
});

CanvasTrack.prototype.setSize = function(h, w) {
  this.el.height = h;
  this.el.width = w;
  this.ctx.strokeStyle = "rgba(200, 200, 200, 0.3)";
  this.ctx.lineWidth = 15;
  this.ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
};

CanvasTrack.prototype.startSelection = function (e) {
  var rect = this.el.getBoundingClientRect();
  this.pos[0] = e.clientX - rect.left;
  this.pos[1] = e.clientY - rect.top;
  this.canvasArea = new r.CanvasArea({pos: this.pos, form: this.form, ctx: this.ctx});
  this.mouseMoveHandler = this.drawSelection.bind(this);
  this.mouseUpHandler = this.validSelection.bind(this);
  this.el.addEventListener('mousemove', this.mouseMoveHandler);
  this.el.addEventListener('mouseup', this.mouseUpHandler);
}

CanvasTrack.prototype.clearCanvas = function() {
  this.setSize(this.el.height, this.el.width);
};

CanvasTrack.prototype.drawSelection = function(e) {
  var rect = this.el.getBoundingClientRect();
  this.pos[0] = e.clientX - rect.left;
  this.pos[1] = e.clientY - rect.top;
  this.canvasArea.refresh(this.pos);
};

CanvasTrack.prototype.validSelection = function(e) {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  this.canvasArea.previous = this.canvasArea.clone();
  this.fire('validSelection', this.canvasArea);
};

CanvasTrack.prototype.reset = function() {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  this.pos = [];
};

return CanvasTrack;
});
