sand.define('ProjectViewer', [
  'FileContainer',
  'Seed',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM',
  'DataPackage/Controller->DP'
], function(r) {

var ProjectViewer = r.Seed.extend({

  options: function() {
    return {
      data : null,
      dp: new r.DP({
        data: {
          projects: [{ id: -1, idParent: -1, name: 'Untitled' }],
          files: [{ id: -1, idParent: -1, idProject: -1, name: 'Untitled', size: 0, type: 'none', content: 'empty' }],
          comments: [{ id: -1, idParent: -1, idFile: -1, content: 'empty', actualTop: 0, areas:{}, resolved: false, author: 'Unnamed' }]
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
          this.create(r.UploadFile, { complete : this.onAddFile.bind(this) }, 'upload').el,
          { tag : '.files-list', as : 'filesList' }
        ]],

        ['.files-block', ['.files']]
      ]
    }
  },

  '+init' : function() {
    if (this.data == null) {
      this.data = {projects: [{id: -1, idParent: -1, name: 'No project yet', files: [] }]};
    }
    this.setCurrent(this.data.projects.last());
  },

  setCurrent : function(project) {
    this.current = project;

    this.id = project.id;
    this.idParent = project.idParent;
    this.name.innerHTML = project.name;

    this.filesList.innerHTML = '';
    this.files.innerHTML = '';

    /*Search file in data and print*/

    for (var i = 0, len = project.files.length; i< len; i++) {
      if (this.current.id == project.files[i].idProject) {
        this._appendFile(project.files[i]);
      }
    }
  },

  onAddFile : function(file) {
    // this.data.files.push(file); //todo //server // il faudra changer ça quand on pluguera avec le serveur
    this._appendFile(file);
  },

  _appendFile : function(file) {
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
    // this.data.files.push(file); //todo //server // il faudra changer ça quand on pluguera avec le serveur
    this.files.replaceChild(this.create(r.FileContainer, { data : data.file }, 'lastFile').el,
      data.prevFile);
    this.lastFile.on('newVersion', this.replaceFile.bind(this), this);
  },

  createProject : function() {
    //todo //server bind this with socket

    var newProject = {
      name : 'Default Project Name',
      idProject: this.current.id
    };

    /*Send to server*/
    this.setCurrent(newProject);
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
return ProjectViewer;
});
