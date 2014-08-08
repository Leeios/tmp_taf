sand.define('ViewFile', [
  'DOM/toDOM'
], function(r) {

var ViewFile = function() {

  this.el = r.toDOM({
    tag: "pre.viewFile",
     attr: {
      unselectable: 'on',
      onselectstart: 'return false;',
      onmousedown: 'return false;'
    }
  });
}

ViewFile.prototype.refreshContent = function(s) {
  this.el.innerHTML = s;
  hljs.highlightBlock(this.el);
};

return ViewFile;

})
