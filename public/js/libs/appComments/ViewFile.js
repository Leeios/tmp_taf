sand.define('ViewFile', [
  'DOM/toDOM'
], function(r) {

var ViewFile = Seed.extend({

  tpl: {
    tag: "pre.viewFile",
     attr: {
      unselectable: 'on',
      onselectstart: 'return false;',
      onmousedown: 'return false;'
    }
  }
});

ViewFile.prototype.refreshContent = function(s) {
  this.el.innerHTML = s;
  hljs.highlightBlock(this.el);
};

return ViewFile;
})
