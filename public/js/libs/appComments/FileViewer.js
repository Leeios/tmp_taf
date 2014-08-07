sand.define('FileViewer', [
  'DOM/toDOM'
], function(r) {

var FileViewer = function() {

  this.el = r.toDOM({
    tag: "pre",
     attr: {
      unselectable: 'on',
      onselectstart: 'return false;',
      onmousedown: 'return false;'
    }
  });
}

FileViewer.prototype.refreshContent = function(s) {
  this.el.innerHTML = s;
  hljs.highlightBlock(this.el);
};

return FileViewer;

})
