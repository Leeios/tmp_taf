sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM'
], function(r) {

var FileContainer = Seed.extend({

  tpl: function() {
    return {
        tag: 'div.container',
        children: [
          ['.container-info', [
            {tag: 'div.container-name.name', as: 'name'},
            this.create(r.VersionPicker, {
              addEl: this.create(r.UploadFile, { complete: this.setVersion.bind(this)}).el,
              onPick: this.setVersion.bind(this)
            }, 'versionPicker').el
          ]],
          ['.container-content', [
            this.create(r.ColComments, {}, 'colComments').el,
            { tag: 'pre.content',
              as: 'content',
              attr: {
                unselectable: 'on',
                onselectstart: 'return false;',
                onmousedown: 'return false;'
              }
            }
          ]]
        ]
      }
    },

  options : function() {
    return {
      data: null,
      txt: "",
      canvasTrack: this.create(r.CanvasTrack, {form: "points"})
    };
  },

  '+init': function() {
    ['add', 'edit', 'delete'].each(function(e) {
      this.colComments.on(e, function(data) {
        this.fire(e, {data: data, uidFile: this.id, model: 'Comment'});
      }.bind(this))
    }.bind(this));

    this.observer = new MutationObserver(this.mutation.bind(this));
    var config = { childList: true };
    this.observer.observe(this.content, config);

    if (typeof this.data.id == "undefined")
      this.id = this.guid()();
    else
      this.id = this.data.id;

    this.name.setAttribute('id', this.id);
    this.name.innerHTML = this.data.name;

    this.content.innerHTML = this.data.content;
    this.txt = this.data.content;
    hljs.highlightBlock(this.content);

    this.colComments.setComGroup(this.data.comments, this.canvasTrack.getCtx());
    this.colComments.addReplies(this.data.comments);
    this.canvasTrack.on('valid', this.colComments.addArea.bind(this.colComments));
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack));
  },

  mutation: function(mutations) {
    this.canvasTrack.setSize(this.content.clientHeight, this.content.clientWidth);
    this.content.appendChild(this.canvasTrack.el);
    this.observer.disconnect();
  },

  setVersion: function(file) {
    this.fire('newVersion', {file: file, prevFile: this.el});
  },

  formate: function() {
    var formateFile = {};
    formateFile.model = "File";
    formateFile.name = this.name;
    formateFile.id = this.id;
    formateFile.content = this.txt;
    // formateFile.comments = this.colComments.formate();
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
