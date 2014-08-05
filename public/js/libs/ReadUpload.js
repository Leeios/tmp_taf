sand.define('ReadUpload', [
  'DOM/toDOM',
], function(r) {

var ReadUpload = function() {

  this.content = r.toDOM({
    tag: "pre",
    as: "content",
    attr: {
      "class": "brush: js;"
    },
    style: {
      "background-color": "#4F4F4F",
      border: "1px groove black",
      width: "80%"
    }
  }, document);
  this.sFile = r.toDOM({
    tag: "input",
    attr: { type: "file" },
  }, document);
  document.body.appendChild(this.sFile);
  document.body.appendChild(this.content);
  this.sFile.addEventListener("change", this.uploadFile);
}

  ReadUpload.prototype.uploadFile = function(e) {
    var reader = new FileReader();

    reader.readAsText(this.files[0]);
    reader.addEventListener("loadend", function (e) {
      document.content.innerHTML = this.result.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      SyntaxHighlighter.highlight();
    })
  };

return ReadUpload;
});
