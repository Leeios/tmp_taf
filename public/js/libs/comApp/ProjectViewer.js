sand.define('ProjectViewer', [
  'FileContainer',
  'Seed',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM'
], function(r) {

var ProjectViewer = Seed.extend({

  options: function() {
    return {
      data : null
    }
  },

  tpl : function() {
    return {
      tag: 'div.project',
      children : [
        ['.project-row.row', [
          {tag: 'div.project-name', as: 'name'},
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
      this.data = {id: -1, idParent: -1, projects: [{name: ''}], files: []};
    }
    this.setCurrent(this.data.projects.last());
  },

  setCurrent : function(project) {
    this.current = project;

    this.name.innerHTML = this.current.name;

    this.filesList.innerHTML = '';
    this.files.innerHTML = '';

    this.getFiles();
  },

  getFiles : function() { // récupère tous les fichiers qui sont dans le projet courant (la version courante)
    if (this.data === null) { return ;}
    for (var i = 0, len = this.data.files.length; i< len; i++) {
      if (this.current.id == this.data.files[i].idProject) {
        this._appendFile(this.data.files[i]);
      }
    }
  },

  onAddFile : function(file) {
    // this.data.files.push(file); //todo //server // il faudra changer ça quand on pluguera avec le serveur
    this._appendFile(file);
  },

  _appendFile : function(file) {
    this.filesList.appendChild(r.toDOM({
      tag : '.file ' + file.name,
      events : {
        click : function() {
          this.toFile(file);
        }.bind(this)
      }
    }));
    this.files.appendChild(this.create(r.FileContainer, { data : file }).el);
  },

  createProject : function() {
    //todo //server bind this with socket

    var newProject = {
      name : 'Default Project Name'
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
