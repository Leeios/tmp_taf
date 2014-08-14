sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'Info',
  'DOM/toDOM'
], function(r) {

var FileContainer = Seed.extend({

  tpl: function() {
    return {
        tag: 'div.fileContainer',
        children: [
          this.infoFile.el,
          this.colComments.el,
          this.content
        ]
      }
    },

  options : function() {
    return {
      infoFile: new r.Info(),
      content: r.toDOM({
        tag: 'pre.content',
        attr: {
          unselectable: 'on',
          onselectstart: 'return false;',
          onmousedown: 'return false;'
        }
      }),
      canvasTrack: new r.CanvasTrack(),
      colComments: new r.ColComments()
    };
  },

  mutation: function(mutations) {
    this.canvasTrack.setSize(this.content.clientHeight, this.content.clientWidth);
    this.content.appendChild(this.canvasTrack.el);
  },

  setFile: function(file) {
    var observer = new MutationObserver(this.mutation.bind(this));
    var config = { attributes: true }
    observer.observe(this.content, config);

    this.infoFile.setName(file.name);
    this.content.innerHTML = file.content;
    hljs.highlightBlock(this.content);
    this.colComments.setComGroup(file.comments, this.canvasTrack.getCtx());
    this.canvasTrack.on('valid', this.colComments.addArea.bind(this.colComments));
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack));
  },

  formate: function() {
    var formateFile = {};
    formateFile.content = this.content.innerHTML;
    formateFile.comments = this.colComments.formate();
    return formateFile;
  }

});
return FileContainer;
});
