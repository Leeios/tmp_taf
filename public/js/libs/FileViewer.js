sand.define('FileViewer', [
  'OnFire',
  'DOM/toDOM'
], function(r) {

var FileViewer = function() {

  this.el = r.toDOM({
    tag: "pre",
    style: {
      "z-index": 0
    }
  });
}

FileViewer.prototype.refreshContent = function(s) {
  this.el.innerHTML = s;
  hljs.highlightBlock(this.el);
};

return FileViewer;

})
