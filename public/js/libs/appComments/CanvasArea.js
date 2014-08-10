sand.define('CanvasArea', [
  'Seed'
], function(r) {

var CanvasArea = Seed.extend({

  '+options': {
    origin: [],
    end: [],
    form: "empty",
    ctx: null
  },
  '+init': function() {
    this.origin = this.origin.slice(0);
    this.end = this.end.slice(0);
  }
});

CanvasArea.prototype.refresh = function(end) {
  this.previous = this.clone();
  this.end = end.slice(0);
  this.draw();
}

CanvasArea.prototype.draw = function () {
  this.previous && this.clearForm.bind(this.previous)();
  if (this.form == "rectangle") {
    this.ctx.fillRect(this.origin[0], this.origin[1], this.end[0] - this.origin[0], this.end[1] - this.origin[1]);
  } else {
    console.log("This form is not implemented yet");
  }
};

CanvasArea.prototype.clone = function() {
  var copy = new CanvasArea({origin: this.origin, end: this.end, form: this.form, ctx: this.ctx});
  return (copy);
};

CanvasArea.prototype.clearForm = function() {
  if (this.form == "rectangle") {
    this.ctx.clearRect(this.origin[0], this.origin[1], this.end[0] - this.origin[0], this.end[1] - this.origin[1]);
  } else {
    console.log("This form is not implemented yet");
  }
};

return CanvasArea;
});
