sand.define('Container', [
  'Seed',
  'FileContainer'
], function(r) {

var Container = Seed.extend({

  tpl: {
    tag: 'div.container',
  },

  options: {
    filesContainer: []
  },

  addFile: function(file) {
    var tmpFileContainer = new r.FileContainer();
    tmpFileContainer.setFile(file);
    this.el.appendChild(tmpFileContainer.el);
    this.filesContainer.push(tmpFileContainer);
    ['add', 'edit', 'delete'].each(function(e) {
      tmpFileContainer.on(e, function(data) {
        this.serv.sendData(e, data);
      }.bind(this))
    }.bind(this));
  },

  setFiles: function(data) {
    for (var i = 0, len = data.length; i < len; i++) {
      this.addFile(data.files[i]);
    }
    console.log(data.comments);
  },

  setServ: function(serv) {
    this.serv = serv;
  },

  formate: function() {
    var formateFiles = [];
    for (var i = 0, len = this.filesContainer.length; i < len; i++) {
      formateFiles.push(this.filesContainer[i].formate());
    }
    return formateFiles;
  }

});
return Container;
});
