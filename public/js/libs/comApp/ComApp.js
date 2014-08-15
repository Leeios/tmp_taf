sand.define('ComApp', [
  'Seed',
  'ServerInterface',
  'Project',
  'ProjectName',
  'UserName',
  'UploadFile'
], function(r) {

/*
**Fire: 0
**On:   5
*/
var appComments = Seed.extend({

  '+options': {
    servData: null
  },

  'init': function() {
    /*Project*/

    this.servInterface = new r.ServerInterface({server: socket, protocol: "socket"});

    this.project = new r.Project();
    this.project.relayServ(this.servInterface);
    this.project.setData(this.servData);

    this.projectName = new r.ProjectName();
    document.body.appendChild(this.projectName.el);
    this.projectName.on('name', function(s) {
      this.project.setName(s);
      this.servInterface.sendData('add', this.project.formate());
    }.bind(this));


    /*UploadFiles*/
    this.uploadFile = new r.UploadFile();
    document.body.appendChild(this.uploadFile.el);
    this.uploadFile.on('uploadFile', function(file) {
      var parseFile = this.project.addFile(file);
      this.servInterface.sendData('add', parseFile);
    }.bind(this));
    this.uploadFile.on('uploadEnd', function () {
      /*-MutationObserver peut être setsize les canvas ici*/
    }.bind(this));



    /*Username*/
    this.userName = new r.UserName();
    this.userName.on('userName', function(s) {
      this.project.setUsername(s);
    }.bind(this));
    document.body.appendChild(this.userName.el);


    /*Server import*/
    this.project.on('requestServer', function(dataInfo) {
      this.servInterface.receiveData(dataInfo);
    }.bind(this));
    this.servInterface.on('resultServer', function(data) {
      this.project.setData(data);
    }.bind(this));

  document.body.appendChild(this.project.el);

  }

});
return appComments;
});
