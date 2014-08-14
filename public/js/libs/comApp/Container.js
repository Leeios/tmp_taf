sand.define('Container', [
  'Seed',
  'FileContainer'
], function(r) {

var Container = Seed.extend({

  tpl: {
    tag: 'div.container',
  },

  '+options': {
    filesContainer: []
  },

  addFile: function(file) {
    var tmpFileContainer = new r.FileContainer();
    tmpFileContainer.setFile(file);
    this.filesContainer.push(tmpFileContainer);
    console.log(this.filesContainer);
    this.el.appendChild(tmpFileContainer.el);
  },

  formate: function() {
    var formateFiles = [];

    for (var i = 0, len = this.filesContainer.length; i < len; i++) {
      formateFiles.push(this.filesContainer[i].formate());
    }
    return formateFiles;
  },

  setFiles: function() {
    for (var i = 0, len = this.filesContainer.length; i < len; i++) {
      this.filesContainer[i].setFile(data[i]);
    }
  },

});
return Container;
});
