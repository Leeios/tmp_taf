sand.define('Info', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var Info = Seed.extend({

  tpl: function() {
    return {
      tag: 'div.info',
      children: [ this.aBalise, this.newVersion ]
    }
  },

  options: function() {
    return {
      name: "unnamed",
      versions: [],
      aBalise: r.toDOM({
        tag: 'a'
      }),
      newVersion: r.toDOM({
        tag:"input.addVersion.button",
        attr: { type: "button", value: "New version" }
      })
    }
  },

  setName: function(s, id) {
    this.newVersion.addEventListener("click", function() {
      console.log("click for new version");
      this.fire('newVersion');
    }.bind(this));
    this.name = s;
    this.aBalise.setAttribute("name", id);
    this.el.innerHTML += s;
  },

  addVersion: function(s) {
    this.versions.push(s);
    this.el.innerHTML += "&nbsp&nbsp&nbsp&nbsp" + s;
  }

});
return Info;
});
