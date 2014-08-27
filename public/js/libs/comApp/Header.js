sand.define('Header', [
  'DOM/toDOM',
  'Seed'
], function(r) {

var Header = Seed.extend({

  tpl: function() {
    return {
      tag: 'div.header',
      children: [ this.banner, this.newProject ]
    }
  },

  options: function() {
    return {
      banner: r.toDOM({
        tag: 'img.banner',
        attr: { src: '/img/banner.gif' }
      }),
      newProject: r.toDOM({
        tag: 'div.projectNameButton',
        innerHTML: 'NEW PROJECT',
        events: {
          click: function() {
            this.fire('newProject:click');
          }.bind(this)
        }
      })
    }
  }

});
return Header;
});
