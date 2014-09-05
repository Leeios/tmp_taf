sand.define('Header', [
  'DOM/toDOM',
  'Seed'
], function(r) {

var Header = r.Seed.extend({

  tpl: function() {
    return {
      tag: 'div.header',
      children: [
        // { tag: 'img.banner', attr: { src: '/img/banner.jpg' } },
        { tag: 'div.header-project', innerHTML: 'New Project',
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
