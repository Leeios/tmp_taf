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
            this.create(r.ColComments, {}, 'colComments').el,
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
            ]}
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

    /*set commentaires & replies*/
    this.colComments.setComGroup(this.id, this.canvasTrack.getCtx());

    /*Echanges entre canvas et colcom*/
    this.canvasTrack.on('valid', this.colComments.addArea.bind(this.colComments));
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack));
  },

  setContent: function(file) {
    this.txt = file.content;
    this.wrapContent.innerHTML = '';
    var tmp = r.toDOM({
      tag: 'pre',
      innerHTML: file.content,
      attr: {
        unselectable: 'on',
        onselectstart: 'return false;',
        onmousedown: 'return false;'
      }
    });
    tmp.setAttribute('class', 'brush: js');
    this.wrapContent.appendChild(tmp);
    SyntaxHighlighter.highlight();

    console.log(this.wrapContent.clientHeight, this.wrapContent.clientWidth);
    this.canvasTrack.setSize(this.wrapContent.clientHeight, this.wrapContent.clientWidth);
    this.wrapContent.appendChild(this.canvasTrack.el);

    this.colComments.resetCol();
    this.colComments.setComGroup(file.id, this.canvasTrack.getCtx());
  }

});
return FileContainer;
});
