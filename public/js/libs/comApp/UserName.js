sand.define('UserName', [
  'Seed'
], function(r) {

var UserName = r.Seed.extend({

  tpl: {
    tag: 'input.userName',
  },

  '+options': {
    name: 'unnamed'
  },

  '+init': function() {
    this.el.addEventListener('click', function() {
      this.name = this.el.value;
      this.fire('name', this.name);
    }.bind(this));
  }

});
return UserName;
});
