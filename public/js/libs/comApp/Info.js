sand.define('Info', [
  'Seed'
], function(r) {

var Info = Seed.extend({

  tpl: {
    tag: 'div.info'
  },

  '+options': {
    name: "unnamed",
    versions: []
  },

  setName: function(s) {
    this.name = s;
    this.el.innerHTML = s;
  },

  addVersion: function(s) {
    this.versions.push(s);
    this.el.innerHTML += "   -   " + s;
  }

});
return Info;
});
