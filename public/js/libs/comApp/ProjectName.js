sand.define('ProjectName', [
  'Seed',
  'DOM/toDOM'
], function(r) {

var ProjectName = Seed.extend({

  tpl: {
    tag: 'div.projectNameButton',
  },

  '+options': {
    name: 'unnamed'
  },

  '+init': function() {
    this.el.addEventListener('click', function() {
      var tmpInput = r.toDOM({
        tag: 'input.projectName'
      });
      document.body.appendChild(tmpInput);
      tmpInput.addEventListener('keypress', function(e) {
        if (e.charCode == 13) {
          this.fire('name', tmpInput.value);
          tmpInput.remove();
        }
      }.bind(this));
    }.bind(this));
  }

});
return ProjectName;
});
