sand.define('VersionPicker', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var VersionPicker = r.Seed.extend({

  tpl: function() {
    return {
      tag: 'div.project-version',
      children: [this.addEl]
    }
  },

  options: function() {
    return {
      onPick: function(id) {
        console.log('Version ' + id + ' is not available');
      },
      onAdd: function() {
        console.log('Versioning is not available for this element');
      },
      addEl: r.toDOM({
        tag: 'div.addVersion.button', innerHTML: '+',
        events: { click: function() { this.onAdd(); }.bind(this) }
      })
    }
  },

  addVersion: function(file) {
    var newVersion = r.toDOM({
      tag: 'div.versionProject.button',
      innerHTML: file.name,
      events: {
        click: function() { this.onPick(file.id); }.bind(this)
      }
    });
    this.el.appendChild(document.createTextNode('   •   '))
    this.el.appendChild(newVersion);
  }

});
return VersionPicker;
});
