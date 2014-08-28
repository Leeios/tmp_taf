sand.define('ComApp', [
  'Seed',
  'ServerInterface',
  'ProjectViewer',
  'Header',
  'UserName',
  'UploadFile'
], function(r) {

/*
**Fire: 0
**On:   5
*/
var appComments = Seed.extend({

  options: function() {
    return {
      data: null
    }
  },

  '+init': function() {

    this.create(r.ServerInterface, {server: socket, protocol: "socket"}, 'servInterface');

    this.create(r.Header, {}, 'header');
    this.header.on('newProject:click', this.createProject.bind(this), this);

    this.projectViewer = this.create(r.ProjectViewer, {data : this.data}, 'projview');

    this.el = document.body;

    this.el.appendChild(this.header.el);
    this.el.appendChild(this.projectViewer.el);
  },

  createProject : function() {
    //todo //server bind this with socket

    var newProject = {
      name : 'Untitled'
    };

    /*Send to server*/
    this.projectViewer.setCurrent(newProject);
  }

});
return appComments;
});


//     this.servInterface = new r.ServerInterface({server: socket, protocol: "socket"});

//     this.project = new r.Project();
//     document.body.appendChild(this.project.el);
//     this.project.relayServ(this.servInterface);
//     this.project.setData(this.servData);

//     this.projectName = new r.ProjectName();
//     document.body.appendChild(this.projectName.el);
//     this.projectName.on('name', function(s) {
//       this.project.setName(s);
//       this.servInterface.sendData('add', this.project.formate());
//       this.project.setVersion('v0.0');
//       this.servInterface.sendData('add', this.project.formate());
//     }.bind(this));


//     /*UploadFiles*/
//     this.uploadFile = new r.UploadFile();
//     this.project.header.el.appendChild(this.uploadFile.el);/*Placage à l'arrache du upload dans le header*/
//     this.uploadFile.on('uploadFile', function(file) {
//       var parseFile = this.project.addFile(file);
//       this.servInterface.sendData('add', parseFile);
//     }.bind(this));
//     this.uploadFile.on('uploadEnd', function () {
//       /*-MutationObserver peut être setsize les canvas ici*/
//     }.bind(this));



//     /*Username*/
//     this.userName = new r.UserName();
//     this.userName.on('userName', function(s) {
//       this.project.setUsername(s);
//     }.bind(this));
//     document.body.appendChild(this.userName.el);


//     /*Server import*/
//     this.project.on('requestServer', function(dataInfo) {
//       this.servInterface.receiveData(dataInfo);
//     }.bind(this));
//     this.servInterface.on('resultServer', function(data) {
//       this.project.setData(data);
//     }.bind(this));


//   }

// });
// return appComments;
// });
