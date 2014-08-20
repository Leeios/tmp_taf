sand.define('Info', [
  'Seed'
], function(r) {

var Info = Seed.extend({

  tpl: {
    tag: 'a.info'
  },

  options: {
    name: "unnamed",
    versions: []
  },

  setName: function(s, id) {
    this.name = s;
    this.el.setAttribute("name", id);
    this.el.innerHTML = s;
  },

  addVersion: function(s) {
    this.versions.push(s);
    this.el.innerHTML += "&nbsp&nbsp&nbsp&nbsp" + s;
  }

});
return Info;
});
