sand.define('Project', [
  'Container',
  'GenerateLink',
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
        this.gLink.el,
        this.infoProj.el,
        this.container.el
      ]
    };
  },

  'options': function() {
    return {
      userName: "unnamed",
      name: "unnamed",
      versions: [],
      header: new r.HeaderFile(),/*single*/
      infoProj: new r.Info(),/*used for files too*/
      container: new r.Container(),/*single*/
      gLink: new r.GenerateLink(),
      uid: -1,
      uidParent: -1
    };
  },

  setData: function(data) {
    if (data === null)
      return ;
    /*Gerer le multi version*/
    console.log(data);
    this.name = data.name;
    this.infoProj.setName(this.name);
    this.uid = data.versions[0].uid; /*Attribuer par defaut la première version*/
    this.infoProj.addVersion(data.versions[0].name);
    this.uidParent = data.versions[0].uidParent;
    this.gLink.setLink(this.uidParent);
    for (var i = 0, len = data.files[0].length; i < len; i++) {
      this.addFile(data.files[0][i]);
    }
    this.container.addComs(data.comments)
  },

  setName: function(s) {
    this.name = s;
    this.uid = this.guid()();
    this.gLink.setLink(this.uid);
    this.infoProj.setName(s);
  },

  setVersion: function(s) {
    this.name = s;
    this.infoProj.addVersion(s);
    this.uidParent = this.uid;
    this.uid = this.guid()();
  },

  relayServ: function(serv) {
    this.container.setServ(serv);
  },

  formate: function() {
    var formateProj = {};

    formateProj.model = "Project";
    formateProj.name = this.name;
    //formateProj.files = this.container.formate();
    formateProj.uid = this.uid;
    formateProj.uidParent = this.uidParent;
    return formateProj;
  },

  addFile: function(file) {
    this.container.addFile(file);
    this.header.addFile(file);
    var last_add = this.container.formate();
    last_add = last_add[last_add.length - 1];
    last_add.uidProject = this.uid;
    return last_add;
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
