sand.define('UploadFile', [
  'DOM/toDOM',
  'Publisher'
], function(r) {

var UploadFile = function() {

  this.el = r.toDOM({
    tag: "input.uploadFile",
    attr: { type: "file" },
  }, document.body);

  this.el.addEventListener("change", this.uploadFile.bind(this));
}

UploadFile.prototype.uploadFile = function(e) {
  var reader = new FileReader();

  this.fire("fileMeta", this.el.files[0]);
  reader.readAsText(this.el.files[0]);
  reader.addEventListener("loadend", function (e) {
    this.fire('uploadDone', reader.result.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  }.bind(this));
}

UploadFile = r.Publisher.extend(UploadFile);
return UploadFile;
});
