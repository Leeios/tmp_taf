sand.define('Header', [
  'DOM/toDOM',
  'Seed'
], function(r) {

var Header = Seed.extend({

  tpl: function() {
    return {
      tag: 'div.header',
      children: [
        { tag: 'img.banner', attr: { src: '/img/banner.gif' } },
        { tag: 'div.projectNameButton', innerHTML: 'NEW PROJECT',
          events: {
            click: function() {
              this.fire('newProject:click');
            }.bind(this)
          }
        }
      ]
    }
  },

});
return Header;
});
