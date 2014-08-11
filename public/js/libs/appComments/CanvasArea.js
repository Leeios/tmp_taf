sand.define('CanvasArea', [
  'Seed'
], function(r) {

var CanvasArea = Seed.extend({

  '+options': {
    origin: [],
    end: [],
    points: [],
    form: "empty",
    ctx: null
  },
  '+init': function() {
    this.origin = this.origin.slice(0);
    this.end = this.end.slice(0);
    this.points = this.points.slice(0);
  }
});

CanvasArea.prototype.refresh = function(end) {
  if (this.form == "rectangle") {
    this.previous = this.clone();
    this.end = end.slice(0);
  } else if (this.form == "points") {
    this.end = end.slice(0);
    this.points.push(this.end);
  }
  this.drawCurrent();
}

CanvasArea.prototype.draw = function () {
  if (this.form == "rectangle") {
    this.previous && this.clearForm.bind(this.previous)();
    this.ctx.fillRect(this.origin[0], this.origin[1], this.end[0] - this.origin[0], this.end[1] - this.origin[1]);
  } else if (this.form == "points"){
    if (!this.points[0]) { return ; }
    this.runPath();
    } else {
    console.log("This form is not implemented yet");
  }
};

CanvasArea.prototype.clone = function() {
  var copy = new CanvasArea({origin: this.origin, end: this.end, points: this.points, form: this.form, ctx: this.ctx});
  return (copy);
};

CanvasArea.prototype.clearForm = function() {
  if (this.form == "rectangle") {
    this.ctx.clearRect(this.origin[0], this.origin[1], this.end[0] - this.origin[0], this.end[1] - this.origin[1]);
  } else if (this.form == "points") {
    // this.runPath();
  } else {
    console.log("This form is not implemented yet");
  }
};

CanvasArea.prototype.runPath= function() {
  if (!this.points[0]) { return ; }
  this.ctx.beginPath();
  this.ctx.moveTo(this.points[0][0], this.points[0][1]);
  for (var i = 1, len = this.points.length; i < len; i++) {
    this.ctx.lineTo(this.points[i][0], this.points[i][1]);
  }
  this.ctx.stroke();
}

//Bug zappe points ?
CanvasArea.prototype.drawCurrent= function() {
  var len = this.points.length - 1;
  if (len < 2) { return ; }
  this.ctx.beginPath();
  this.ctx.lineTo(this.points[len - 1][0], this.points[len - 1][1]);
  this.ctx.lineTo(this.points[len][0], this.points[len][1]);
  this.ctx.stroke();
}

return CanvasArea;
});
