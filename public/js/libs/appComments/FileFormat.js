sand.define('FileFormat', [
  'Seed'
], function(r) {

  var FileFormat = Seed.extend({
    'init': function() {
      this.uid = this.guid()();
      this.model = 'File';
    }
  });


FileFormat.prototype.setMeta = function(meta) {
  this.name = meta.name;
  this.size = meta.size;
  this.type =  meta.type;
};

FileFormat.prototype.setContent = function(content) {
  this.content = content;
};

FileFormat.prototype.setFile = function(data) {
  this.name = data.name;
  this.size = data.size;
  this.type = data.type;
  this.content = data.content;
  this.uid = data.uid;
};

FileFormat.prototype.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
};

  return FileFormat;
});
