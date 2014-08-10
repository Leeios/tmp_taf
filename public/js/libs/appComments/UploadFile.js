sand.define('UploadFile', [
  'DOM/toDOM',
  'Seed'
], function(r) {

var UploadFile = Seed.extend({

  tpl: {
    tag: "input.uploadFile",
    attr: { type: "file" },
  },
  '+init': function () {
    this.el.addEventListener("change", this.uploadFile.bind(this));
  }
})

UploadFile.prototype.uploadFile = function(e) {
  var reader = new FileReader();

  this.fire("fileMeta", this.el.files[0]);
  reader.readAsText(this.el.files[0]);
  reader.addEventListener("loadend", function (e) {
    this.fire('uploadDone', reader.result.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  }.bind(this));
}

return UploadFile;
});
