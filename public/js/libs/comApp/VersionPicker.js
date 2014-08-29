sand.define('VersionPicker', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var VersionPicker = Seed.extend({

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

  addVersion: function(id) {
    var newVersion = r.toDOM({
      tag: 'div.versionProject',
      innerHTML: 'id Version',
      events: {
        click: function() { this.onPick(id); }.bind(this)
      }
    });
    this.el.appendChild(newVersion);
  }

});
return VersionPicker;
});
