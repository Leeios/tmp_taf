sand.define('MainComment', [
  'Comment',
  'CommentsGroup',
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var MainComment = r.CommentsGroup.extend({

  tpl: {
    tag: '.main-comment'
  },

  options: {
    areas: [],
    schema: r.Comment
  },

  '+init': function() {
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.el.appendChild(this.create(this.schema, {
      onMouseOver: this.highStyle.bind(this),
      onMouseOut: this.usualStyle.bind(this)
    }, 'mainComment').el);
    console.log(this.el)
  },

  /*Areas functions*/
  addArea: function(canArea) {/*INTERFACE*/
    this.areas.push(canArea);
    this.mainComment.actualTop = canArea.points[canArea.points.length - 1][0];
    this.el.style.top = this.actualTop + "px";
  },

  displayArea: function() {
    for (var i = 0, len = this.areas.length; i < len; i++) {
      this.areas[i].draw();
    }
  },

  highStyle: function() {
    this.areas[0] && ((this.areas[0].ctx.strokeStyle =  this.color) && (this.areas[0].ctx.globalAlpha = 0.3));
    this.displayArea();
    this.areas[0] && (this.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.el.style["background-color"] = "#fefefe";
    this.fire('redraw');
    this.displayArea();
  },

  /*Use for import dataserv*/
  setAreas: function(data, ctx) {
    var current_area;
    for (var i = 0, len = data.length; i < len; i++) {
      current_area = this.create(r.CanvasArea, {points: data[i], ctx: ctx});
      this.areas.push(current_area);
    }
  }

});
return MainComment;
});
