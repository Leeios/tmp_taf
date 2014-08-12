sand.define('FileGroup', [
  'Seed',
  'FileFormat'
], function(r) {


/*
**Fire: 0
**On:   0
*/
var FileGroup = Seed.extend({
  'init': function() {
    this.uid = this.guid()();
    this.files = [];
  },

  pushFile: function(f) {
    var file = new r.FileFormat();
    file.setFile(f);
    file.uid = this.uid;
    this.files.push(file);
  },

  setFiles: function(data) {
    for (var i = 0, len = data.length; i < len; i++) {
      this.pushFile(data[i]);
    }
  },

  /*Use for send servdata*/
  getFiles: function(data) {
    var data = {};
    data.model = 'File';
    data.files = this.files;
    return (data);
  },

  renderContent: function(i) {
    return (this.files[i].content)
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
return FileGroup;
});
