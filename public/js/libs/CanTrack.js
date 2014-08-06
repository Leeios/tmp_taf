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
  this.el = r.toDOM({
    tag: "canvas",
    as: "canWindow",
    attr : {
      height: h,
      width: w
    },
    style: {
      position: "absolute",
      top: "0px",
      left: "0px",
      "z-index": 1
    }
  }, document.body);
  this.el.addEventListener('mousedown', this.startSelection.bind(this));
}

CanTrack.prototype.setSize = function(h, w) {
  this.el.height = h;
  this.el.width = w;
};

CanTrack.prototype.startSelection = function (e) {
  var rect = this.el.getBoundingClientRect();
  this.origin[0] = e.clientX - rect.left;
  this.origin[1] = e.clientY - rect.top;
  this.canArea = new r.CanArea(this.origin, this.origin, this.form, this.el.getContext("2d"));
  this.mouseMoveHandler = this.drawSelection.bind(this);
  this.mouseUpHandler = this.validSelection.bind(this);
  this.el.addEventListener('mousemove', this.mouseMoveHandler);
  this.el.addEventListener('mouseup', this.mouseUpHandler);
}

CanTrack.prototype.drawSelection = function(e) {
  var rect = this.el.getBoundingClientRect();
  this.end[0] = e.clientX - rect.left;
  this.end[1] = e.clientY - rect.top;
  this.canArea.refresh(this.origin, this.end, this.form);
  this.canArea.draw();
};

CanTrack.prototype.validSelection = function(e) {
  this.el.removeEventListener('mousemove', this.mouseMoveHandler);
  this.el.removeEventListener('mouseup', this.mouseUpHandler);
  this.fire('validSelection', this.canArea);
};

CanTrack = r.Publisher.extend(CanTrack);
return CanTrack;
});
