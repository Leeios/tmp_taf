sand.define('Project', [
  'Seed'
], function(r) {

var Project = Seed.extend({

  tpl: {
    tag: 'div.proj',
  },

  '+options': {
    name: "unnamed",
    files: [],
    header: new r.HeaderFile(),
    genLink: new r.GenerateLink()
  },

  '+init': function() {
    this.uid = this.guid()();
  },

  setName: function(s) {
    this.name = s;
  },

  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  }

});
return Project;
});
