sand.define('GenerateLink', [
  'DOM/toDOM'
], function(r) {

  var GenerateLink = function() {
    this.link = "";
    this.el = r.toDOM({
      tag: 'input.generateLink',
      attr: {
        readOnly: 'true',
        value: 'No link yet'
      }
    });
    this.el.addEventListener('click', function() {
      this.el.setSelectionRange(0, this.el.value.length);
    }.bind(this));
  }

  GenerateLink.prototype.getLink = function(link) {
    this.link = link;
    this.el.value = this.link;
  };

  return GenerateLink;
});
