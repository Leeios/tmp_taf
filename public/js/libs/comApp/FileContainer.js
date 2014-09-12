sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'ColComments',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM'
], function(r) {

var FileContainer = r.Seed.extend({

  tpl: function() {
    return {
        tag: '.container', children: [
          ['.container-info', [
            {tag: '.container-name.name', as: 'name'},
            this.create(r.VersionPicker, {
              addEl: this.create(r.UploadFile, {
                complete: function(file) {
                  this.newVersion(file, this);
                }.bind(this)
              }).el,
              onPick: function(id) { this.setVersion.bind(this)(this, id); }.bind(this)
            }, 'versionPicker').el
          ]],
          ['.container-file', [
            {tag: '.wrap-content', as: 'wrapContent', children: [
              this.create(r.CanvasTrack, {form: "points"}, 'canvasTrack').el,
              { tag: 'pre.content',
                as: 'content',
                attr: {
                  unselectable: 'on',
                  onselectstart: 'return false;',
                  onmousedown: 'return false;'
                }
              }
            ]},
            this.create(r.ColComments, {dp: this.query('dp')}, 'colComments').el
          ]]
      ]
    }
  },

  options : function() {
    return {
      data: null,
      newVersion: function() { console.log('Versioning not available on this element'); },
      setVersion: function() { console.log('Cannot set version for this element'); },
      txt: "",
    };
  },

  '+init': function() {

    /*set attributes*/
    this.id = this.data.id;
    this.idProject = this.data.idProject;
    this.idParent = this.data.idParent;
    this.name.setAttribute('id', this.id);
    this.name.innerHTML = this.data.name;

    /*set & decore content*/
    this.setContent(this.data);

    /*Echanges entre canvas et colcom*/
    this.canvasTrack.on('valid', this.colComments.addArea.bind(this.colComments), this);
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack), this);
  },

  setCanvas: function() {
    this.canvasTrack.setSize(this.wrapContent.clientHeight, this.wrapContent.clientWidth);
    this.complete.disconnect();
    this.wrapContent.appendChild(this.canvasTrack.el);
  },

  setContent: function(file) {
    this.wrapContent.innerHTML = '';
    this.txt = file.content;

    if (file.name.match(/\.(jpg)|(jpeg)|(gif)|(png)$/i) || this.name.innerHTML.match(/\.(jpg)|(jpeg)|(gif)|(png)$/i)) {
      var img = new Image();
      img.src = file.content;
      this.wrapContent.appendChild(img);
    } else {
      this.wrapContent.appendChild(r.toDOM({
        tag: 'pre',
        innerHTML: file.content,
        attr: {
          class: 'brush: js',
          unselectable: 'on',
          onselectstart: 'return false;',
          onmousedown: 'return false;'
        }
      }));
      SyntaxHighlighter.highlight();
    }

    this.complete = new MutationObserver(this.setCanvas.bind(this));
    this.complete.observe(this.wrapContent, { childList: true });
    this.colComments.resetCol(this.wrapContent.clientHeight, file.id, this.canvasTrack.getCtx());
  }

});
return FileContainer;
});
