sand.define('ViewFile', [
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var ViewFile = Seed.extend({

  tpl: {
    tag: "pre.viewFile",
     attr: {
      unselectable: 'on',
      onselectstart: 'return false;',
      onmousedown: 'return false;'
    }
  },

  refreshContent: function(s) {
    this.el.innerHTML = s;
    hljs.highlightBlock(this.el);
  }

});
return ViewFile;
})
