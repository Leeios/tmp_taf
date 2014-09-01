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
    this.sendToServer();
    this.setDataToDP();
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
                    this.insertFile(file);
                  }.bind(this));
  },

  insertFile : function(file) {

    this.dp.files.insert(file);
    this.files.appendChild(this.create(r.FileContainer, { data : file, newVersion: this.editFile.bind(this) }, 'lastFile').el);

    if (this.filesList.innerHTML != '') {
      this.filesList.innerHTML += ' • ';
    }
    this.filesList.appendChild(r.toDOM({
      tag : 'a.file',
      innerHTML: this.lastFile.name.innerHTML,
      attr : { href: '#' + this.lastFile.id }
    }));
  },

  editFile: function(file, prevFile) {
    this.dp.files.where('id', prevFile.id)[0].remove();
    this.dp.files.insert(file);
    /*Replace in fileslist*/
    this.files.replaceChild(this.create(r.FileContainer, { data : file, newVersion: this.editFile.bind(this) }, 'lastFile').el,
      prevFile.el);
  },

  createProject : function() {
    var newProject = this.dp.projects.insert({
      name : 'Default Project Name',
      idProject: this.current.id
    });

    this.setCurrent(newProject);
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
      this.dp.projects.on(e, function(models, changes) {this.server.emit(e, {models: models, changes: changes, type: 'project'})}.bind(this));
      this.dp.files.on(e, function(models, changes) {this.server.emit(e, {models: models, changes: changes, type: 'file'})}.bind(this));
      this.dp.comments.on(e, function(models, changes) {this.server.emit(e, {models: models, changes: changes, type: 'comment'})}.bind(this));
    }.bind(this));
  }

});
return ProjectViewer;
});
