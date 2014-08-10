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
    form: "empty"
  },
  '+init': function (options) {
    this.origin =[];
    this.end =[];
    this.finish = 0;
    this.ctx = this.el.getContext("2d");
    this.el.addEventListener('mousedown', this.startSelection.bind(this));
    this.el.addEventListener('mouseout', this.reset.bind(this));
  }
});

CanvasTrack.prototype.setSize = function(h, w) {
  this.el.height = h;
  this.el.width = w;
};

CanvasTrack.prototype.startSelection = function (e) {
  var rect = this.el.getBoundingClientRect();
  this.origin[0] = e.clientX - rect.left;
  this.origin[1] = e.clientY - rect.top;
  this.canvasArea = new r.CanvasArea({origin: this.origin, end: this.origin, form: this.form, ctx: this.ctx});
  this.mouseMoveHandler = this.drawSelection.bind(this);
  this.mouseUpHandler = this.validSelection.bind(this);
  this.finish = 0;
  this.el.addEventListener('mousemove', this.mouseMoveHandler);
  this.el.addEventListener('mouseup', this.mouseUpHandler);
}

CanvasTrack.prototype.drawSelection = function(e) {
  var rect = this.el.getBoundingClientRect();
  this.end[0] = e.clientX - rect.left;
  this.end[1] = e.clientY - rect.top;
  this.ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
  this.canvasArea.refresh(this.end);
};

CanvasTrack.prototype.validSelection = function(e) {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  this.finish = 1;
  this.canvasArea.previous = this.canvasArea.clone();
  this.fire('validSelection', this.canvasArea);
};

CanvasTrack.prototype.reset = function() {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  if (this.finish == 0 && this.canvasArea) {
    this.canvasArea.clearForm();
  }
  this.origin = [];
  this.end = [];
};

return CanvasTrack;
});
