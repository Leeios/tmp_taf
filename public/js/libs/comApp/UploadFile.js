sand.define('UploadFile', [
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 2
**On:   0
*/
var UploadFile = r.Seed.extend({

  tpl: function() {
    return {
      tag: "input.upload-file.button",
      attr: { type: "file", multiple: "multiple" }
    }
  },

  options: function() {
    return {
      complete: function() {
        console.log('FileView not defined');
      }
    }
  },

  '+init': function () {
    this.el.addEventListener("change", this.uploadFile.bind(this));
  },

  parseFile: function(fRead, end) {
    var reader = new FileReader();
    var file = {};

    /*Copy attr*/
    file.name = fRead.name;
    file.size = fRead.size;
    file.type = fRead.type;

    reader.readAsText(fRead);
    reader.addEventListener("loadend", function (e) {
      file.content = reader.result.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      this.complete(file);
      if (end) { this.fire('uploadEnd'); }
    }.bind(this));
  },

  uploadFile: function(e) {
    for (var i = 0, len = this.el.files.length; i < len; i++) {
      this.parseFile(this.el.files[i], (i == len - 1));
    }
  }

});
return UploadFile;
});
