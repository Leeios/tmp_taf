sand.define('CanTrack', [
  'DOM/toDOM',
  'Publisher',
  'CanArea'
], function(r) {

/*Put form (rectangle, circle) in parameter, this.form = form then*/
var CanTrack = function(h, w) {

  this.origin =[];
  this.end =[];
  this.form = "rectangle";
  this.finish = 0;
  this.el = r.toDOM({
    tag: "canvas.canWindow",
    attr : {
      height: h,
      width: w
    }
  }, document.body);
  this.ctx = this.el.getContext("2d");
  this.el.addEventListener('mousedown', this.startSelection.bind(this));
  this.el.addEventListener('mouseout', this.reset.bind(this));
}

CanTrack.prototype.setSize = function(h, w) {
  this.el.height = h;
  this.el.width = w;
};

CanTrack.prototype.startSelection = function (e) {
  var rect = this.el.getBoundingClientRect();
  this.origin[0] = e.clientX - rect.left;
  this.origin[1] = e.clientY - rect.top;
  this.canArea = new r.CanArea(this.origin, this.origin, this.form, this.ctx);
  this.mouseMoveHandler = this.drawSelection.bind(this);
  this.mouseUpHandler = this.validSelection.bind(this);
  this.finish = 0;
  this.el.addEventListener('mousemove', this.mouseMoveHandler);
  this.el.addEventListener('mouseup', this.mouseUpHandler);
}

CanTrack.prototype.drawSelection = function(e) {
  var rect = this.el.getBoundingClientRect();
  this.end[0] = e.clientX - rect.left;
  this.end[1] = e.clientY - rect.top;
  this.ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
  this.canArea.refresh(this.end);
};

CanTrack.prototype.validSelection = function(e) {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  this.finish = 1;
  this.canArea.previous = this.canArea.clone();
  this.fire('validSelection', this.canArea);
};

CanTrack.prototype.reset = function() {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  if (this.finish == 0 && this.canArea) {
    this.canArea.clearForm();
  }
  this.origin = [];
  this.end = [];
};

CanTrack = r.Publisher.extend(CanTrack);
return CanTrack;
});
