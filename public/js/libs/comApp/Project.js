sand.define('Project', [
  'Container',
  'HeaderFile',
  'Info',
  'Seed'
], function(r) {

var Project = Seed.extend({

  tpl: {
    tag: 'div.wrapper',
  },

  '+options': {
    userName: "unnamed",
    name: "unnamed",
    header: new r.HeaderFile(),/*single*/
    infoProj: new r.Info(),/*used for files too*/
    container: new r.Container(),/*single*/
    uid: -1,
    uidParent: -1
  },

  '+init': function() {
    this.el.appendChild(this.header.el);
    this.el.appendChild(this.infoProj.el);
    this.el.appendChild(this.container.el);
  },

  setData: function(data) {
    if (data == null) {
      return ;
    }
    this.name = data.name;
    /*...*/
  },

  setName: function(s) {
    this.name = s;
    this.uid = this.guid()();
    this.infoProj.setName(s);
  },

  formate: function() {
    var formateProj = {};

    formateProj.model = "file";
    formateProj.name = this.name;
    formateProj.files = this.container.formate();
    formateProj.uid = this.uid;
    formateProj.uidParent = this.uidParent;
    return formateProj;
  },

  addFile: function(file) {
    this.container.addFile(file);
    this.header.addFile(file);
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
