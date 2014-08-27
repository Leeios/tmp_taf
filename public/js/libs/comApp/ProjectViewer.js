sand.define('ProjectViewer', [
  'Container',
  'Seed',
  'VersionPicker',
  'UploadFile'
], function(r) {

var ProjectViewer = Seed.extend({

  options: function() {
    return {
      data : null
    }
  },

  tpl : function() {
    return {
      children : [
        ['.project-row.row', [
          '.name',
          this.create(r.VersionPicker, { onPick : this.setCurrent.bind(this) }, 'versionPicker').el, // ça permet juste de faire this.versionPicker = this.create(r.VersionPicker)
        ]],

        ['.file-nav-row.row', [
          this.create(r.UploadFile, { complete : this.onAddFile.bind(this) }, 'upload'),
          { tag : '.files-list', as : 'filesList' }
        ]],

        ['.files-block', ['.files']]
      ]
    }
  },

  '+init' : function() {
    // console.log(this.data)
    if (data === null) {
      this.newProject();
    } else {
      this.setCurrent(this.data.projects.last());
    }
  },

  setCurrent : function(project) {
    this.current = project;
    this.versionPicker.setCurrent(this.current);

    this.name.innerHTML = this.current.name;

    // on reset la liste des fichiers et l'affichage des fichiers et de leurs commentaires
    this.filesList.innerHTML = '';
    this.files.innerHTML = '';

    this.getFiles().each(this._appendFile.bind(this));
  },

  getFiles : function() { // récupère tous les fichiers qui sont dans le projet courant (la version courante)
    return this.data.files.where(function(e) {
      return e.project_id === this.current.id
    }.bind(this));
  },

  onAddFile : function(file) {
    this.data.files.push(file); //todo //server // il faudra changer ça quand on pluguera avec le serveur
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
    this.files.appendChild(this.create(r.FileContainer, { file : file, data : this.data }).el);
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
