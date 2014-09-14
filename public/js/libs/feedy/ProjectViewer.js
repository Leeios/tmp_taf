sand.define('ProjectViewer', [
  'Seed',
  'DataPackage/Controller->DP',
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
      children : [
        ['.project-info', [
          {tag: 'div.project-name.name', as: 'name', events: {click: this.editName.bind(this)}},
          this.create(r.VersionPicker, {
            onPick: this.setCurrent.bind(this),
            onAdd: this.addVersion.bind(this) }, 'versionPicker').el,
        ]],
        {tag: '.file-nav.usual', as: 'projectNav', children: [
          this.create(r.UploadFile, { complete : this.insertFile.bind(this), txt: 'Add' }, 'upload').el,
          { tag : '.files-list', as : 'filesList' }
        ]},
        {tag: '.files-block', as: 'files'}
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
    this.sendToServer();
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
    setTimeout(function() {
      window.location.replace(window.location.origin + '/' + newProject[0].id)
    }.bind(this), 2000);
  },

  editName: function() {
    this.name.setAttribute('contenteditable', true);
    this.name.focus();
    this.name.onkeypress = function(e) {
      if (e.charCode === 13) {
        this.name.setAttribute('contenteditable', false);
        this.dp.projects.one(function(e) { return e.id === this.current.idParent }.bind(this)).edit({'name': this.name.innerHTML})
      }
    }.bind(this)
  },

  setDataToDP: function() {
    if (this.data === null) { return ; }
    ['projects', 'files', 'comments'].each(function(e) {
      for (var i = 0, len = this.data[e].length; i < len; i++) {
        if (e == 'projects') { this._setProjectFromData(this.data[e][i]); }
        else { this.dp[e].insert(this.data[e][i]); }
      }
    }.bind(this))
  },

  _setProjectFromData: function(proj) {
    if (proj.idParent == 0) {
      var saveIdParent = proj.id;
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

    var versionsFile = [];
    this.dp.files.where(function(e) { return this.current.id === e.idProject; }.bind(this))
          .each( function (file) {
            if (file.idParent == 0) {
              versionsFile.push(this.appendFile(file));
            }
            else {
              var parentElem = versionsFile.one(function(e) { return e.id == file.idParent }.bind(this));
              if (parentElem == null) { return ; }
              parentElem.versionPicker.addVersion(file);
              parentElem.setContent(file);
            }
          }.bind(this));
  },

  insertFile: function(file) {
    var tmpcontent = file.content;
    file.content.innerHTML = 'Master file: No content available';
    file.idProject = this.id;
    file.idParent = 0;
    this.dp.files.insert(file);
    tmpFile = this.appendFile(file);
    this.addVersionFile({name: 'v.0', content: tmpcontent}, tmpFile);
  },

  appendFile : function(file) {
    var elem = this.create(r.FileContainer, { data : file,
      newVersion: this.addVersionFile.bind(this), setVersion: this.setVersionFile.bind(this) });
    this.files.appendChild(elem.el);
    this.filesList.appendChild(this.create(r.toDOM, {
      tag : 'a.file-anchor',
      innerHTML: elem.name.innerHTML,
      attr : { href: '#' + elem.id }
    }));
    return (elem);
  },

  addVersionFile: function(file, prevFile) {
    file.idParent = prevFile.idParent != 0 ? prevFile.idParent : prevFile.id;
    file.idProject = prevFile.idProject;
    this.dp.files.insert(file);

    prevFile.versionPicker.addVersion(file);
    prevFile.setContent(file);/*Equivalent à setVersionfile mais on s'evite une seach inutile*/
  },

  setVersionFile: function(file, idVersion) {
    var version = this.dp.files.one(function(e) { return e.id == idVersion}.bind(this));
    file.setContent(version);
  },

  sendToServer: function() {
    ['insert', 'edit', 'remove'].each(function(e) {
      var data = {};
      this.dp.projects.on(e, function(models, changes) {
        this._emitServer(e, 'projects', models, changes);
      }.bind(this));
      this.dp.files.on(e, function(models, changes) {
        this._emitServer(e, 'files', models, changes);
      }.bind(this));
      this.dp.comments.on(e, function(models, changes) {
        this._emitServer(e, 'comments', models, changes);
      }.bind(this));
    }.bind(this));
  },

  getData: function(type, data) {
    if (type == 'projects') {
      return { id: data.id, idParent: data.idParent, name: data.name };
    } else if (type == 'files') {
      return { id: data.id, idParent: data.idParent, idProject: data.idProject, name: data.name, content: data.content };
    } else if (type == 'comments') {
      return { id: data.id, idParent: data.idParent, idFile: data.idFile, txt: data.txt, areas: data.areas,
        author: data.author, actualTop: data.actualTop, color: data.color, date: data.date };
    } else {
      console.log('Data not valid');
      return null;
    }
  },

  _emitServer: function(e, type, models, changes) {
    console.log('Send Server: ', e, this.getData(type, models[0]), changes, type);
    this.server.emit(e, {models: this.getData(type, models[0]), changes: changes, type: type});
  }

});
return ProjectViewer;
});
