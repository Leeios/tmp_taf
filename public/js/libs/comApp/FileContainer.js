sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM'
], function(r) {

var FileContainer = r.Seed.extend({

  tpl: function() {
    return {
        tag: 'div.container',
        children: [
          ['.container-info', [
            {tag: 'div.container-name.name', as: 'name'},
            this.create(r.VersionPicker, {
              addEl: this.create(r.UploadFile, { complete: this.setVersion.bind(this)}).el,
              onPick: this.setVersion.bind(this)//CHANGE!
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

    console.log(this.query('dp'));

    /*On attend le load du content pour set la canvas size*/
    this.observer = new MutationObserver(this.setCanvas.bind(this));
    var config = { childList: true };
    this.observer.observe(this.content, config);

    /*set attributes*/
    this.id = this.data.id;
    this.name.setAttribute('id', this.id);
    this.name.innerHTML = this.data.name;

    /*set & decore content*/
    this.content.innerHTML = this.data.content;
    this.txt = this.data.content;
    hljs.highlightBlock(this.content);

    /*set commentaires & replies*/
    this.colComments.setComGroup(this.data.comments, this.canvasTrack.getCtx());
    this.colComments.addReplies(this.data.comments);

    /*Echanges entre canvas et colcom*/
    this.canvasTrack.on('valid', this.colComments.addArea.bind(this.colComments));
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack));

    /*Listen comments*/
    this.commentsBridge();
  },

  setCanvas: function(mutations) {
    this.canvasTrack.setSize(this.content.clientHeight, this.content.clientWidth);
    this.content.appendChild(this.canvasTrack.el);
    this.observer.disconnect();
  },

  commentsBridge: function() {
    ['insert', 'edit', 'remove'].each(function(e) {
      this.colComments.on(e, function(data) {
        data.idFile = this.id;
        this.fire(e, data);
      }.bind(this));
    }.bind(this))
  },

  setVersion: function(file) {
    this.fire('newVersion', {file: file, prevFile: this});//Create new version here, get back oninsert in pjview
  }

});
return FileContainer;
});
