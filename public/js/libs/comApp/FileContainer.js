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
      canvasTrack: new r.CanvasTrack({form: "points"}),
      colComments: new r.ColComments()
    };
  },

  '+init': function() {
    ['add', 'edit', 'delete'].each(function(e) {
      this.colComments.on(e, function(data) {
        this.fire(e, {data: data, uid: this.uid, model: 'comment'});
      }.bind(this))
    }.bind(this));
  },

  mutation: function(mutations) {
    this.canvasTrack.setSize(this.content.clientHeight, this.content.clientWidth);
    this.content.appendChild(this.canvasTrack.el);
    this.observer.disconnect();
  },

  setFile: function(file) {
    this.observer = new MutationObserver(this.mutation.bind(this));
    var config = { childList: true };
    this.observer.observe(this.content, config);

    if (typeof file.uid == "undefined")
      this.uid = this.guid()();
    else
      this.uid = file.uid;
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
  },

  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  }

});
return FileContainer;
});
