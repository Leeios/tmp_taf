sand.define('ProjectViewer', [
  'DataPackage/Controller->DP',
  'DOM/toDOM',
  'FileContainer',
  'Seed',
  'UploadFile',
  'VersionPicker'
], function(r) {

var ProjectViewer = r.Seed.extend({

  isMediator: true,
  respondsTo: { dp: function() {return this.dp;} },

  options: function() {
    return {
      data : null,
      server: null,
      dp: new r.DP({
        data: {
          projects: [{id: -1, idParent: -1, name: 'No project yet'}],
          files: [],
          comments: []
        }
      })
    }
  },

  tpl : function() {
    return {
      tag: 'div.project',
      children : [
        ['.project-info.row', [
          {tag: 'div.project-name.name', as: 'name'},
          this.create(r.VersionPicker, {
            onPick: this.setCurrent.bind(this),
            onAdd: this.createProject.bind(this) }, 'versionPicker').el,
        ]],
        ['.file-nav-row.row', [
          this.create(r.UploadFile, { complete : this.insertFile.bind(this) }, 'upload').el,
          { tag : '.files-list', as : 'filesList' }
        ]],

        ['.files-block', ['.files']]
      ]
    }
  },

  '+init' : function() {
    this.setDataToDP();
    this.sendToServer();
    this.setCurrent(this.dp.projects.last());
  },

  setCurrent : function(project) {
    this.current = project;

    this.id = project.id;
    this.idParent = project.idParent;
    this.name.innerHTML = project.name;

    this.filesList.innerHTML = '';
    this.files.innerHTML = '';

    /*Search file in data*/

    this.dp.files.where(function(e) { return this.current.id === e.idProject; }.bind(this))
                  .each( function (file) {
                    this.appendFile(file);
                  }.bind(this));
  },

  insertFile: function(file) {
    file.idProject = this.id;
    file.idParent = -1;
    this.dp.files.insert(file);
    tmpFile = this.appendFile(file);
    tmpFile.idParent = tmpFile.id;
    this.addVersionFile({name: 'v.0', content: file.content}, tmpFile);
  },

  appendFile : function(file) {
    var elem = this.create(r.FileContainer, { data : file,
      newVersion: this.addVersionFile.bind(this), setVersion: this.setVersionFile.bind(this) });
    this.files.appendChild(elem.el);
    if (this.filesList.innerHTML != '') {
      this.filesList.innerHTML += ' • ';
    }
    this.filesList.appendChild(r.toDOM({
      tag : 'a.file',
      innerHTML: elem.name.innerHTML,
      attr : { href: '#' + elem.id }
    }));
    return (elem);
  },

  addVersionFile: function(file, prevFile) {
    file.idParent = prevFile.idParent;
    file.idProject = prevFile.idProject;
    this.dp.files.insert(file);

    prevFile.versionPicker.addVersion(file);
    prevFile.setContent(file.content);/*Equivalent à setVersionfile mais on s'evite une seach inutile*/
  },

  setVersionFile: function(file, idVersion) {
    var version = this.dp.files.one(function(e) { return e.id == idVersion}.bind(this));
    file.setContent(version.content);
  },

  createProject : function() {
    var newProject = this.dp.projects.insert({
      name : 'Default Project Name',
      idParent: -1
    });
    var projV0 = this.dp.projects.insert({
      name : 'Default Project Name',
      idParent: newProject.id
    });
    this.setCurrent(projV0);
  },

  setDataToDP: function() {
    if (this.data === null) { return ; }
    ['projects', 'files', 'comments'].each(function(e) {
      for (var i = 0, len = this.data[e].length; i < len; i++) {
        this.dp[e].insert(this.data[e][i]);
      }
    })
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
      return { id: data.id, idParent: data.idParent, idProject: data.idProject, name: data.name };
    } else if (type == 'comments') {
      return { id: data.id, idParent: data.idParent, idFile: data.idFile, txt: data.txt,
        author: data.author, actualTop: data.actualTop, color: data.color };
    } else {
      console.log('Data not valid');
      return null;
    }
  },

  _emitServer: function(e, type, models, changes) {
    console.log(e, this.getData(type, models[0]), changes, type);
    this.server.emit(e, {models: this.getData(type, models[0]), changes: changes, type: type});
  }

});
return ProjectViewer;
});
