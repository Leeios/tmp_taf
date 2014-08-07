sand.define('CanArea', [
], function(r) {

var CanArea = function(origin, end, form, ctx) {

  this.origin = origin || [];
  this.end = end || [];
  this.form = form || "rectangle";
  this.ctx = ctx;
}

CanArea.prototype.refresh = function(origin, end, form) {
  origin && (this.origin = origin);
  end && (this.end = end);
  form && (this.form = form);
}

CanArea.prototype.draw = function () {
  // this.previous && this.clearForm.bind(this.previous)();
  // this.previous = this.clone();
  this.ctx.clearRect(0, 0, document.body.canWindow.width, document.body.canWindow.height);
  this.ctx.fillStyle = "rgba(0, 0, 200, 0.3)";
  if (this.form == "rectangle") {
    this.ctx.fillRect(this.origin[0], this.origin[1], this.end[0] - this.origin[0], this.end[1] - this.origin[1]);
  } else {
    console.log("This form is not implemented yet");
  }
};

CanArea.prototype.clone = function() {
  var copy = new CanArea(this.origin, this.end, this.form, this.ctx);
  return (copy);
};

CanArea.prototype.clearForm = function() {
  if (this.form == "rectangle") {
    this.ctx.clearRect(0, 0, document.body.canWindow.width, document.body.canWindow.height);
    // this.ctx.clearRect(this.origin[0], this.origin[1], this.end[0] - this.origin[0], this.end[1] - this.origin[1]);
  } else {
    console.log("This form is not implemented yet");
  }
};

return CanArea;
});
