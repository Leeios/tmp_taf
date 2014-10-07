sand.define('ProjectViewer', [
  'Seed',
  'DataPackage/Controller->DP',
  'Library',
  'FileContainer',
  'UploadFile',
  'VersionPicker',
  'DOM/toDOM'
], function(r) {

var ProjectViewer = r.Seed.extend({

  isMediator: true,
  respondsTo: { dp: function() {return this.dp;} },

  options: function() {
    return {
      data : null,
      server: null,
      idParent: 0,
      dp: new r.DP({
        data: {
          projects: [{id: 0, idParent: 0, name: 'No project yet'}],
          files: [],
          comments: []
        }
      })
    }
  },

  tpl : function() {
    return {
      tag: '.project.usual',
      children : [/*Ask info*/
        {tag: '.loading.usual', as: 'loadEl'},
        {tag: '.form-block', as: 'form', children: [
          {tag: 'input.form-name.usual', as: 'formName', attr: {placeholder: 'Enter your name...'}},
          {tag: 'input.form-email.usual', as: 'formMail', attr: {placeholder: 'Enter your mail...'}},
          ['table.form-container-box.usual', [
            ['tr.usual', [
              {tag: 'td.form-box-name', innerHTML: 'Subscribe to Project versions'},
              ['td', [
                {tag: 'input.form-box', attr: {type: 'checkbox'}, as: 'formBoxProj',innerHTML: 'Project'}
              ]],
            ]],
            ['tr.usual', [
              {tag: 'td.form-box-name', innerHTML: 'Subscribe to add/edit/remove Files'},
              ['td', [
              {tag: 'input.form-box', attr: {type: 'checkbox', maxlength: 16}, as: 'formBoxFiles',innerHTML: 'Files'},
              ]]
            ]],
            ['tr.usual', [
              {tag: 'td.form-box-name', innerHTML: 'Subscribe to add/edit/remove Comments'},
              ['td', [
              {tag: 'input.form-box', attr: {type: 'checkbox', maxlength: 64}, as: 'formBoxCom',innerHTML: 'Comments'},
              ]]
            ]]
          ]],
          {tag: '.form-valid.usual.button', innerHTML: 'VALID', events: {
            click: function() {
              document.cookie = 'name=' + (this.formName.value || 'unnamed') + ';';
              document.cookie = 'mail=' + (this.formMail.value || 'none') + ';';
              this.validInfo();
            }.bind(this)
          }},
        ]},/*!Ask info*/
        ['.project-info', [
          {tag: '.switch-display.tool-tip.fa.fa-arrows-h.button', as: 'switchEl', events: {click: function() {
            if (this.switchEl.className == 'switch-display tool-tip fa fa-arrows-h button') {
              this.switchEl.className = 'switch-display tool-tip fa fa-arrows-v button';
            } else {
              this.switchEl.className = 'switch-display tool-tip fa fa-arrows-h button';
            }
            window.onhashchange = this.switchDisplay.bind(this);
            this.switchDisplay();
          }.bind(this)}},
          {tag: 'div.project-name.name', as: 'name', events: {click: this.editName.bind(this)}},
          this.create(r.VersionPicker, {
            onPick: this.setCurrent.bind(this),
            onAdd: this.addVersion.bind(this) }, 'versionPicker').el,
        ]],
        {tag: '.file-nav.usual', as: 'projectNav', children: [
          this.create(r.UploadFile, { complete : this.insertFile.bind(this), diffColor: '#ffffff'}, 'upload').el,
          { tag : '.files-list', as : 'filesList' }
        ]},
        {tag: '.files-block', as: 'files'},
        {tag: '.foot-element', innerHTML: 'Copyright (c) Meuh'}
      ],
    }
  },

  '+init' : function() {

    /*Listen scroll*/
    window.addEventListener('scroll', function(e) {
      this.actualTop = this.projectNav.offsetTop || this.actualTop;
      if (document.body.scrollTop > this.actualTop) {
        this.projectNav.setAttribute('class', 'fixed-top file-nav');
      } else {
        this.projectNav.setAttribute('class', 'usual file-nav');
      }
    }.bind(this));

    this.setDataToDP();
    this.listenFiles();
    this.listenServer();
    this.sendToServer();

    /*Ask name & mail*/
    if (r.Library.getCookie('name') != '') {
      this.validInfo();
    }
  },

  validInfo:  function() {
    var subsmod = (this.formBoxProj.checked ? 1 : 0) + (this.formBoxFiles.checked ? 2 : 0) + (this.formBoxCom.checked ? 4 : 0);
    this.server.emit('subscribe', {
      name: r.Library.getCookie('name'),
      mail: this.formMail.value,
      nameProj: this.name.innerHTML,
      idProject: this.current ? this.current.idParent || this.current.id : 0,
      subscribes: subsmod
    })
    this.form.remove();
  },

  listenServer: function() {
    ['insert', 'edit', 'remove'].each(function(s) {
      socket.on(s, function(data) {
        console.log('Receive from server:', s, data);
        this.subServ[s][data.type].un();/*On coupe le renvoi serveur*/
        if (s === 'insert') {
          this.dp[data.type][s](data.models, data.changes);
        } else {
          this.dp[data.type].one(function(m) {return m.id === data.models.id}.bind(this))[s](data.changes);
        }
        this.subServ[s][data.type] = this.dp[data.type].on(s, function(models, changes) {/*On remet le renvoi serveur*/
          this._emitServer(s, data.type, models, changes);
        }.bind(this))
      }.bind(this))
    }.bind(this))
  },

  listenFiles: function() {
    this.dp.files.on('insert', this.addFile.bind(this))
    this.dp.files.on('edit', this.editFile.bind(this));
    this.dp.files.on('remove', this.removeFile.bind(this));
  },

  editFile: function() {
    // console.log('File edited in projview');
  },

  createProject : function() {
    var newProject = [this.dp.projects.insert({
      name : 'Default Project Name',
      idParent: 0
    })];
    var projv0 = [this.dp.projects.insert({
      name : 'V0',
      idParent: newProject[0].id
    })];
    socket.on('InsertProj', function(id) {
      if (id == projv0[0].id) {
        window.location.replace(window.location.origin + '/' + newProject[0].id)
      }
    }.bind(this));
  },

  editName: function() {
    if (this.name.isContentEditable === true) { return ;}
    this.name.setAttribute('contenteditable', true);
    this.name.focus();
    r.Library.eventOut('click', this.name, function() {
      this.name.setAttribute('contenteditable', false)
      this.dp.projects.one(function(e) { return e.id === this.current.idParent }.bind(this)).edit({'name': this.name.innerHTML})
    }.bind(this))
    this.name.onkeypress = function(e) {
      if (e.charCode === 13) {
        this.name.setAttribute('contenteditable', false);
        this.dp.projects.one(function(e) { return e.id === this.current.idParent }.bind(this)).edit({'name': this.name.innerHTML})
      }
    }.bind(this)
  },

  switchDisplay: function() {
    this.files.innerHTML = '';
    if (this.switchEl.className == 'switch-display tool-tip fa fa-arrows-v button') {
      if (!window.location.hash) { return ;}
      for (var i = 0; i < this.fileElems.length; i++) {
        if ('#' + (this.fileElems[i].idParent || this.fileElems[i].id) == window.location.hash) {
          this.files.appendChild(this.fileElems[i].el);
          return ;
        }
      }
    } else {
      for (var i = 0; i < this.fileElems.length; i++) {
        this.files.appendChild(this.fileElems[i].el);
      }
    }
  },

  setDataToDP: function() {
    if (this.data === null) { return ; }
    ['projects', 'files', 'comments'].each(function(e) {
      for (var i = 0, len = this.data[e].length; i < len; i++) {
        if (e == 'projects') { this._setProjectFromData(this.data[e][i]); }
        else { this.dp[e].insert(this.data[e][i]); }
      }
    }.bind(this));
    this.setCurrent(this.dp.projects.one(function(e) {return e.idParent != 0}.bind(this)));
  },

  _setProjectFromData: function(proj) {
    if (proj.idParent == 0) {
      this.dp.projects.insert(proj);
      this.name.innerHTML = proj.name;
      this.setCurrent(proj);
    } else if (proj.idParent == (this.current.idParent != 0 ? this.current.idParent : this.current.id)){
      this.addVersion(proj);
    }
  },

  addVersion: function(projVersion) {
    if (typeof projVersion != 'object') {
      projVersion = { name : 'New Version' };
    }
    projVersion.idParent = this.current.idParent != 0 ? this.current.idParent : this.current.id;
    projVersion.id = this.dp.projects.insert(projVersion).id;
    this.versionPicker.addVersion(projVersion);
    this.setCurrent(projVersion);
  },

  setCurrent : function(project) {
    if (typeof project == 'string') {
      project = this.dp.projects.one(function(e) { return e.id == project }.bind(this));
    }
    this.current = project;

    this.id = project.id;
    this.idParent = project.idParent;

    this.filesList.innerHTML = '';
    this.files.innerHTML = '';

    this.fileElems = [];
    var tmp = this.dp.files.where(function(e) { return this.current.id === e.idProject; }.bind(this))
    if (tmp === null) { this.files.innerHTML = 'No files yet' }
    tmp.each( function (file) {
      if (file.idParent == 0) {
        this.fileElems.push(this.appendFile(file));
      } else {
        this.addVersionFile(this.fileElems.one(function(e) {
          return (e.idParent == file.idParent || e.id == file.idParent)
        }.bind(this)), file);
      }
    }.bind(this));
    this.loadEl.remove();
  },

  insertFile: function(file) {
    var v0content = file.content;
    file.content.innerHTML = 'Master file: No content available';
    file.idProject = this.id;
    file.idParent = 0;
    var v0Id = this.dp.files.insert(file).id;
    var v0File = {};
    v0File.name = 'V0';
    v0File.content = v0content;
    v0File.idParent = v0Id;
    v0File.idProject = this.id;
    this.dp.files.insert(v0File);
  },

  addFile: function(model, op) {
    if (model[0].idProject != this.current.id) {return ;}
    if (model[0].idParent == 0) {
      this.fileElems.push(this.appendFile(model[0]));
    } else {
      this.addVersionFile(this.fileElems.one(function(e) {
        return (e.idParent == model[0].idParent || e.id == model[0].idParent)
      }.bind(this)), model[0]);
    }
  },

  addVersionFile: function(parentFile, file) {
    if (parentFile == null) { return ; }
    parentFile.versionPicker.addVersion(file);
    parentFile.setContent(file);
  },

  appendFile : function(file) {
    var elem = this.create(r.FileContainer, {
      data : file,
      setVersion: this.setVersionFile.bind(this)
    });
    this.files.appendChild(elem.el);
    this.filesList.appendChild(this.create(r.toDOM, {
      tag : 'a.file-anchor',
      innerHTML: elem.name.innerHTML,
      attr : { href: '#' + elem.id }
    }));
    return (elem);
  },

  removeFile: function(model, op) {
    var filesArray = this.filesList.childNodes;
    for (var i = 0, len = filesArray.length; i < len ; i++) {
      if (filesArray[i].href.substr(filesArray[i].href.lastIndexOf('#') + 1) ==  model[0].id) {
        filesArray[i].remove();
        this.files.childNodes[i].remove();
        return ;
      }
    }
  },

  setVersionFile: function(file, idVersion) {
    var version = this.dp.files.one(function(e) { return e.id == idVersion}.bind(this));
    file.setContent(version);
  },

  sendToServer: function() {
    this.subServ = {};
    ['insert', 'edit', 'remove'].each(function(e) {
      this.subServ[e] = {};
      ['projects', 'files', 'comments'].each(function(type) {
        this.subServ[e][type] = this.dp[type].on(e, function(models, changes) {
          this._emitServer(e, type, models, changes);
        }.bind(this));
      }.bind(this))
    }.bind(this));
  },

  getData: function(type, data) {
    if (type == 'projects') {
      return { id: data.id, idParent: data.idParent, name: data.name };
    } else if (type == 'files') {
      return { id: data.id, idParent: data.idParent, idProject: data.idProject, name: data.name, content: data.content };
    } else if (type == 'comments') {
      return { id: data.id, idParent: data.idParent, idFile: data.idFile, txt: data.txt, areas: data.areas,
        author: data.author, actualTop: data.actualTop, actualLeft: data.actualLeft, color: data.color, date: data.date };
    } else {
      console.log('Data not valid');
      return null;
    }
  },

  _emitServer: function(e, type, models, changes) {
    console.log('Send Server: ', e, this.getData(type, models[0]), changes, type);
    this.server.emit(e, {models: this.getData(type, models[0]), changes: changes, type: type, idProject: this.idParent});
  }

});
return ProjectViewer;
});
