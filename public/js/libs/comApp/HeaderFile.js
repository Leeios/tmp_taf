sand.define('HeaderFile', [
  'DOM/toDOM',
  'Seed'
], function(r) {

var HeaderFile = Seed.extend({

  tpl: {
    tag: 'div.header',
  },

  '+options': {
    filesName: []
  },

  display: function() {
    /*Put focus on each file*/
  },

  addFile: function(file) {
    var tmpEl = r.toDOM({
      tag: 'a.headerLink',
      innerHTML: file.name,
      attr: { href: '#' + file.uid }
    });
    this.filesName.push(tmpEl);
    this.el.appendChild(tmpEl);
    this.el.innerHTML += '&nbsp&nbsp&nbsp&nbsp';
  }


});
return HeaderFile;
});
