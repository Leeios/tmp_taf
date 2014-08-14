sand.define('Project', [
  'Container',
  'HeaderFile',
  'Info',
  'Seed'
], function(r) {

var Project = Seed.extend({

  tpl: function() {
    return {
      tag: 'div.wrapper',
      children: [
        this.header.el,
        this.infoProj.el,
        this.container.el
      ]
    };
  },

  'options': function() {
    return {
      userName: "unnamed",
      name: "unnamed",
      header: new r.HeaderFile(),/*single*/
      infoProj: new r.Info(),/*used for files too*/
      container: new r.Container(),/*single*/
      uid: -1,
      uidParent: -1
    };
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
    var last_add = this.container.formate();
    return last_add[last_add.length - 1];
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
