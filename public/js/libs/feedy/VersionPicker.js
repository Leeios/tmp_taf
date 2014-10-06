sand.define('VersionPicker', [
  'Seed',
  'DOM/toDOM',
  'Library'
], function(r) {

var VersionPicker = r.Seed.extend({

  tpl: function() {
    return {
      tag: '.nav-version',
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
        tag: '.version-name.button', innerHTML: '+',
        events: { click: function() { this.onAdd(); }.bind(this) }
      })
    }
  },

  addVersion: function(data) {
    var newVersion = this.create(r.toDOM, {
      tag: '.version-name.button',
      innerHTML: data.name,
      events: {
        click: function(e) {
          if (e.target.isContentEditable === true) { return ;}
          if (data.id === this.currentVersion) {
            e.target.setAttribute('contenteditable', true);
            e.target.onkeypress = function(k) {
              if (k.charCode === 13) {
                e.target.setAttribute('contenteditable', false);
                var editTmp = this.query('dp').projects.one(function(p) { return p.id === this.currentVersion }.bind(this))
                || this.query('dp').files.one(function(p) { return p.id === this.currentVersion }.bind(this));
                editTmp.edit({'name': e.target.innerHTML})
              }
            }.bind(this);
            r.Library.eventOut('click', e.target, function() {
              e.target.setAttribute('contenteditable', false);
              var editTmp = this.query('dp').projects.one(function(p) { return p.id === this.currentVersion }.bind(this))
              || this.query('dp').files.one(function(p) { return p.id === this.currentVersion }.bind(this));
              editTmp.edit({'name': e.target.innerHTML})
            }.bind(this))
          } else {
            this.onPick(data.id);
            this.currentVersion = data.id;
            /*Add surline current*/
          }
        }.bind(this)
      }
    });
    this.el.appendChild(newVersion);
  }

});
return VersionPicker;
});
