sand.define('GenerateLink', [
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var GenerateLink = r.Seed.extend({
  tpl: {
    tag: 'input.generateLink',
    attr: {
      readOnly: 'true',
      value: 'No link yet'
    }
  },

  '+init': function () {
    this.link = "";
    this.el.addEventListener('click', function() {
      this.el.setSelectionRange(0, this.el.value.length);
    }.bind(this));
  },

  setLink: function(link) {
    this.link = 'http://localhost:3000/' + link;
    this.el.value = this.link;
  }

});
return GenerateLink;
});
