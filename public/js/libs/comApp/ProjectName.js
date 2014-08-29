sand.define('ProjectName', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var ProjectName = r.Seed.extend({

  tpl: {
    tag: 'div.projectNameButton',
    innerHTML: "NEW PROJECT"
  },

  '+options': {
    name: 'unnamed'
  },

  '+init': function() {
    this.el.addEventListener('click', function() {
      var tmpName = r.toDOM({
        tag: 'textarea.projectName',
        attr: { placeholder: "Enter name project..." }
      });
      document.body.appendChild(tmpName);
      tmpName.focus();
      tmpName.addEventListener('keypress', function(e) {
        if (e.charCode == 13) {
          this.fire('name', tmpName.value);
          tmpName.remove();
        }
      }.bind(this));
    }.bind(this));
  }

});
return ProjectName;
});
