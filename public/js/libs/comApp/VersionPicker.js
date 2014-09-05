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
      currentVersion: null,
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

  addVersion: function(data) {
    var newVersion = r.toDOM({
      tag: 'div.versionProject.button',
      innerHTML: data.name,
      events: {
        click: function(e) {
          if (data.id === this.currentVersion) {
            e.target.setAttribute('contenteditable', true);
            e.target.focus();
            e.target.onkeypress = function(k) {
              if (k.charCode === 13) {
                e.target.setAttribute('contenteditable', false);
                var editTmp = this.query('dp').projects.one(function(p) { return p.id === this.currentVersion }.bind(this))
                || this.query('dp').files.one(function(p) { return p.id === this.currentVersion }.bind(this));
                editTmp.edit({'name': e.target.innerHTML})
              }
            }.bind(this)
          } else {
            this.onPick(data.id);
            this.currentVersion = data.id;
            console.log(this);/*Add surline current*/
          }
        }.bind(this)
      }
    });
    this.el.appendChild(newVersion);
  }

});
return VersionPicker;
});
