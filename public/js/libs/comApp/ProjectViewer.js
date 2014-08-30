sand.define('ProjectViewer', [
  'DataPackage/Controller->DP',
  'DOM/toDOM',
  'FileContainer',
  'Seed',
  'UploadFile',
  'VersionPicker'
], function(r) {

var ProjectViewer = r.Seed.extend({

  options: function() {
    return {
      data : null,
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
          this.create(r.UploadFile, { complete : this.addFile.bind(this) }, 'upload').el,
          { tag : '.files-list', as : 'filesList' }
        ]],

        ['.files-block', ['.files']]
      ]
    }
  },

  '+init' : function() {
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

    /*Search file in data and print*/

    this.dp.files.where(function(e) {return this.current.id === e.idProject;}.bind(this))
                  .each(this.addFile.bind(this))
  },

  addFile : function(file) {

    this.dp.files.insert(file);
    this.files.appendChild(this.create(r.FileContainer, { data : file }, 'lastFile').el);
    this.lastFile.on('newVersion', this.replaceFile.bind(this), this);

    if (this.filesList.innerHTML != '') {
      this.filesList.innerHTML += ' • ';
    }
    this.filesList.appendChild(r.toDOM({
      tag : 'a.file',
      innerHTML: this.lastFile.name.innerHTML,
      attr : { href: '#' + this.lastFile.id }
    }));
  },

  replaceFile: function(data) {
    this.dp.files.where('id', data.prevFile.id)[0].remove();
    this.dp.files.insert(data.file);

    this.files.replaceChild(this.create(r.FileContainer, { data : data.file }, 'lastFile').el,
      data.prevFile.el);
    this.lastFile.on('newVersion', this.replaceFile.bind(this), this);
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

  listenComments: function() {
    ['insert', 'edit', 'remove'].each(function(e) {
      this.dp.comments.on(e, function(models, c, o) {
        console.log(e, models);
      }.bind(this));
    }.bind(this))
  }

});
return ProjectViewer;
});
