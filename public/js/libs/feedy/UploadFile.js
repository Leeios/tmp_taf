sand.define('UploadFile', [
  'Seed'
], function(r) {

/*
**Fire: 2
**On:   0
*/
var UploadFile = r.Seed.extend({

  tpl: function() {
    return [
      '.upload-wrapper', [
        {tag: "input.upload-file.button", as: 'uploadButton',
        attr: { type: "file", multiple: "multiple" }},
        {tag: '.upload-fakebutton', innerHTML: this.txt }
      ]]
  },

  options: function() {
    return {
      txt: '+',
      complete: function() {
        console.log('FileView not defined');
      }
    }
  },

  '+init': function () {
    this.uploadButton.addEventListener("change", this.uploadFile.bind(this));
  },

  parseFile: function(fRead, end) {
    var reader = new FileReader();
    var file = {};

    /*Copy attr*/
    file.name = fRead.name;
    file.size = fRead.size;
    file.type = fRead.type;

    if (file.name.match(/\.(jpg)|(jpeg)|(gif)|(png)$/i)) {
      reader.readAsDataURL(fRead);
    } else {
      reader.readAsText(fRead);
    }

    reader.addEventListener("loadend", function (e) {
      if (file.name.match(/\.(jpg)|(jpeg)|(gif)|(png)$/i)) {
        file.content = e.target.result;
      } else {
        file.content = reader.result.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      this.complete(file);
      if (end) { this.fire('uploadEnd'); }
    }.bind(this));
  },

  uploadFile: function(e) {
    for (var i = 0, len = this.uploadButton.files.length; i < len; i++) {
      this.parseFile(this.uploadButton.files[i], (i == len - 1));
    }
  }

});
return UploadFile;
});
