sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'Library',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM'
], function(r) {

var FileContainer = r.Seed.extend({

  tpl: function() {
    return {
        tag: '.file-container', children: [
          ['.file-info.usual', [
            {tag: '.file-name.name', as: 'name', events: {click: this.editName.bind(this)}},
            {tag: '.tool-tip.fa.fa-chevron-circle-right.button', as: 'switchEl', events: {/*fa fa-chevron-circle-left*/
              click: this.switchFormat.bind(this)
            }},
            this.create(r.VersionPicker, {
              addEl: this.create(r.UploadFile, {
                complete: function(file) {
                  file.idParent = this.idParent == 0 ? this.id : this.idParent;
                  file.idProject = this.idProject;
                  this.query('dp').files.insert(file);
                }.bind(this)
              }).el,
              onPick: function(id) { this.setVersion.bind(this)(this, id); }.bind(this)
            }, 'versionPicker').el,
            {tag: '.file-delete.button', as: 'deleteEl', innerHTML: 'Delete', events: {
                click: this.removeFile.bind(this)
              }
            }
          ]],
          {tag: '.file-content.usual', as: 'fileContent' ,children: [
            {tag: '.wrap-content', as: 'wrapContent', children: [
              this.create(r.CanvasTrack, {form: "points"}, 'canvasTrack').el,
            ]},
            this.create(r.ColComments, {dp: this.query('dp')}, 'colComments').el
          ]}
      ]
    }
  },

  options : function() {
    return {
      data: null,
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
    this.canvasTrack.on('valid', this.colComments.suggestComment.bind(this.colComments), this);
    this.canvasTrack.onTarget = this.colComments.canTarget.bind(this.colComments);
    this.canvasTrack.drawAll = this.colComments.drawAreas.bind(this.colComments);
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack), this);

    this.eventMouse();
  },


  eventMouse: function() {
    this.fileContent.onmouseover = function() {
      this.fileContent.onmouseover = '';
      this.el.style.zIndex = 50;
      this.colComments.showCom();
      this.setCanvas();
      this.fileContent.onmouseout = function(e) {
        if (r.Library.recursiveParent(e.toElement, this.colComments.el) === true) {return ;}
        this.el.onmouseout = '';
        this.el.style.zIndex = 5;
        this.colComments.collapseCom();
        this.setCanvas();
        this.eventMouse();
      }.bind(this);
    }.bind(this);
  },

  switchFormat: function() {
    if (this.switchEl.className === 'tool-tip fa fa-chevron-circle-right button') {
      this.switchEl.className = 'tool-tip fa fa-chevron-circle-left button';
      this.wrapContent.setAttribute('class', 'wrap-content tool-content');
      this.colComments.el.setAttribute('class', 'col-comments tool-colcom');
      this.colComments.toolFormat();
      this.fileContent.style.overflowY ='auto';
    } else if (this.switchEl.className === 'tool-tip fa fa-chevron-circle-left button') {
      this.switchEl.className = 'tool-tip fa fa-chevron-circle-right button';
      this.wrapContent.setAttribute('class', 'wrap-content');
      this.colComments.el.setAttribute('class', 'col-comments');
      this.colComments.resetLeft();
      this.fileContent.style.overflowY ='none';
    }
    this.setCanvas();
  },

  editName: function() {
    if (this.name.isContentEditable === true) { return ;}
    this.name.setAttribute('contenteditable', true);
    this.name.focus();
    r.Library.eventOut('click', this.name, function() {
      this.name.setAttribute('contenteditable', false)
      this.query('dp').files.one(function(e) { return e.id === this.idParent || this.id }.bind(this)).edit({'name': this.name.innerHTML})
    }.bind(this))
    this.name.onkeypress = function(e) {
      if (e.charCode === 13) {
        this.name.setAttribute('contenteditable', false);
        this.query('dp').files.one(function(e) { return e.id === this.idParent || this.id }.bind(this)).edit({'name': this.name.innerHTML})
      }
    }.bind(this)
  },

  removeFile: function() {
    this.query('dp').files.where(function(files) { return files.idParent === this.idParent }.bind(this))
    .each(function(files) {
      this.query('dp').comments.where(function(com) { return com.idFile === files.id }.bind(this))
      .each(function(e) {
        e.remove();
      }.bind(this))
      files.remove();
    }.bind(this))

    this.query('dp').files.one(function(e) { return e.id === this.idParent }.bind(this)).remove();
  },

  setCanvas: function() {
    if (this.switchEl.innerHTML === '&gt;&lt;') {
      this.canvasTrack.setSize(this.wrapContent.clientHeight, this.wrapContent.clientWidth);
    } else {
      this.canvasTrack.setSize(this.wrapContent.clientHeight, this.wrapContent.scrollWidth);
    }
    this.colComments.setHeight(this.wrapContent.clientHeight);
    this.complete.disconnect();
    this.wrapContent.appendChild(this.canvasTrack.el);
    this.canvasTrack.drawAll();
  },

  setContent: function(file) {
    this.id = file.id;
    this.idProject = file.idProject;
    this.idParent = file.idParent;

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
          onselectstart: function() {return false;},
          onmousedown: function() {return false;}
        }
      }));
      SyntaxHighlighter.highlight();
    }

    this.complete = new MutationObserver(this.setCanvas.bind(this));
    this.complete.observe(this.wrapContent, { childList: true });
    this.colComments.resetCol(file.id, this.canvasTrack.getCtx());
  }

});
return FileContainer;
});
