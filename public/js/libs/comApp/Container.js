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

  addFile: function(file, indicator) {
    var tmpFileContainer = new r.FileContainer();
    tmpFileContainer.setFile(file);
    this.el.appendChild(tmpFileContainer.el);
    this.filesContainer.push(tmpFileContainer);
    this.subscribeCom(tmpFileContainer);
  },

  subscribeCom: function(com) {
    ['add', 'edit', 'delete'].each(function(e) {
      com.subsOn[e] = com.on(e, function(data) {
        this.serv.sendData(e, data);
      }.bind(this))
    }.bind(this));
  },

  unsubscribeCom: function(com) {
    ['add', 'edit', 'delete'].each(function(e) {
      com.subsOn[e].un();
    });
  },

  addComs: function(comments) {
    for (var i = 0, len = this.filesContainer.length; i < len; i++) {
      this.unsubscribeCom(this.filesContainer[i]);
      this.filesContainer[i].setCom(comments[i]);
      this.subscribeCom(this.filesContainer[i]);
    }
  },

  setFiles: function(data) {
    for (var i = 0, len = data.length; i < len; i++) {
      this.addFile(data.files[i]);
    }
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
