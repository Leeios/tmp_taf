sand.define('HeaderFile', [
  'Seed'
], function(r) {

var HeaderFile = Seed.extend({

  tpl: {
    tag: 'div.header',
  },

  '+options': {
    filesName: []
  },

  display: function() {
    /*Put focus on each file*/
  },

  addFile: function(file) {
    this.filesName.push(file.name);
    this.el.innerHTML += '/' + file.name;
  }


});
return HeaderFile;
});
