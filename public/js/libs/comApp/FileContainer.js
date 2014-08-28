sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'Info',
  'DOM/toDOM'
], function(r) {

var FileContainer = Seed.extend({

  // tpl: function() {
  //   return ({
  //     tag: 'div.fileContainer',
  //     children: [
  //       this.infoFile.el,
  //       this.canvasTrack.el,
  //       this.colComments.el,
  //       this.content
  //     ]
  //   });
  // }(),

  // '+options': function() {
  //   return ({
  //     infoFile: new r.Info(),
  //     canvasTrack: new r.CanvasTrack(),
  //     colComments: new r.ColComments(),
  //     content: r.toDOM({
  //       tag: 'pre.content'
  //     })
  //   });
  // }(),

  tpl: {
      tag: 'div.fileContainer'
    },

  '+options': {
      infoFile: new r.Info(),
      canvasTrack: new r.CanvasTrack(),
      colComments: new r.ColComments(),
      content: r.toDOM({
        tag: 'pre.content'
      })
    },

    '+init': function() {
        this.el.appendChild(this.infoFile.el);
        this.el.appendChild(this.canvasTrack.el);
        this.el.appendChild(this.colComments.el);
        this.el.appendChild(this.content);
    },

  setFile: function(file) {
    this.content.innerHTML = file.content;
    hljs.highlightBlock(this.content);
    this.colComments.setComGroup(file.comments, this.canvasTrack.getCtx());
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
