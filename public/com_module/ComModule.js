sand.define('ComModule', [
  'Seed',
  'DataPackage/Controller->DP',
  'DOM/toDOM',
  'Library',
  'ColComments',
  'CanvasTrack'
], function(r) {

var ComModule = r.Seed.extend({

  isMediator: true,
  respondsTo: { dp: function() {return this.dp;} },

  /*Data init: {item: DOMelement, format: 'column' || 'bubble', canvas: 'on' || 'off', dp: CommonDP}*/
  options: function() {
    return {
      item: null,
      format: 'column',
      canvas: null,
      dp: new r.DP({
        data: {
          comments: []
        }
      })
    }
  },

  '+init': function() {
    this.item ? this.attachComments(this.item, this.canvas) : null;
  },

  /*Link comments to item
  **Data attach: (DOMelement)
  */
  attachComments: function(item, doCanvas) {
    if (!item.tagName) {
      console.log('Comments error: attachComments/ item is not a DOM element');
      return ;
    }
    this.item = item;
    this.colCom = this.create(r.ColComments);
    this.
    doCanvas == 'on' ? this.setCanvas(item) : null;
  },

  /*Place comments in DOM
  **(DOMelement)
  */
  placeComments: function(item) {
    if (!item.tagName) {
      console.log('Comments error: placeComments/ item is not a DOM element');
      return ;
    }
    this.colCom.el.remove();
    item.appendChild(this.colCom.el);
  },

  setCanvas: function(item) {
    this.canvas ? this.canvas.remove() : null;
    this.canvas = this.create(r.canvasTrack);
    this.canvasTrack.setSize(item.clientHeight, item.clientWidth);
    item.appendChild(this.canvas);
  },

  switchFormat: function() {
    if (this.format === 'column') {
      this.colComments.displayColumn();
    } else if (this.format == 'bubble') {
      this.colComments.displayBubble();
    }
  },

  getElement: function() {
    return this.colCom.el;
  }

});
return ComModule;
});
