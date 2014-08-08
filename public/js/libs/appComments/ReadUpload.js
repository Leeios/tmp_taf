sand.define('ReadUpload', [
  'DOM/toDOM',
  'Publisher'
], function(r) {

var ReadUpload = function() {

  this.el = r.toDOM({
    tag: "input.rUpload",
    attr: { type: "file" },
  }, document.body);

  this.el.addEventListener("change", this.uploadFile.bind(this));
}

ReadUpload.prototype.uploadFile = function(e) {
  var reader = new FileReader();

  this.fire("fileMeta", this.el.files[0]);
  reader.readAsText(this.el.files[0]);
  reader.addEventListener("loadend", function (e) {
    this.fire('uploadDone', reader.result.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  }.bind(this));
}

ReadUpload = r.Publisher.extend(ReadUpload);
return ReadUpload;
});
