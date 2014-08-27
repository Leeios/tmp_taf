sand.define('VersionPicker', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var VersionPicker = Seed.extend({

  tpl: function() {
    return {
      tag: 'div.VersionPicker',
    }
  },

  options: function() {
    return {
      onPick: function(id) {
        console.log('Version ' + id + ' is not available');
      }
    }
  },

  addVersion: function(id) {
    var newVersion = r.toDOM({
      tag: div.versionProject,
      events: {
        click: function() { this.onPick(id); }
      }
    })
  }

});
return VersionPicker;
});
