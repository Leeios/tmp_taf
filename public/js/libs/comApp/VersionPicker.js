sand.define('VersionPicker', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var VersionPicker = Seed.extend({

  tpl: function() {
    return {
      children: [{ tag: 'div.addVersion', innerHTML: '+',
      events: {
        click: this.onAdd
      }}]
    }
  },

  options: function() {
    return {
      el: r.toDOM({tag: 'div.project-versions'}),
      onPick: function(id) {
        console.log('Version ' + id + ' is not available');
      },
      onAdd: function() {
        console.log('Versioning is not available for this element');
      }
    }
  },

  addVersion: function(id) {
    var newVersion = r.toDOM({
      tag: div.versionProject,
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
