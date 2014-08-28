sand.define('FileFormat', [
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var FileFormat = Seed.extend({

  setFile: function(data) {
    this.name = data.name;
    this.size = data.size;
    this.type = data.type;
    this.content = data.content;
  }

});
return FileFormat;
});
