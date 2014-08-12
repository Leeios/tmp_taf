sand.define('ComApp', [
  'Seed'
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
    /*Init new project*/

    this.project = new r.Project());
    this.servInterface = new ServerInterface({server: socket, protocol: "socket"});
    if (this.servData == null) {
      var projectName = new r.ProjectName();
      projectName.on('name', function(s) {
        this.project.setName(s);
        this.servInterface.sendData('add', this.project);
      }.bind(this))
    } else {
      this.project.setData(servData);
    }
    this.project.display();

    /*Init page elements*/
    this.userName = new r.UserName();
    this.uploadFile = new r.UploadFile();
    this.uploadFile.on('uploadFile', function(file) {
      var parseFile = this.project.addFile(file);
      this.servInterface.sendData('add', parseFile);
    }.bind(this));
    this.uploadFile.on('uploadEnd', function () {
      this.project.display();
    }.bind(this));


    this.canvasTrack = new r.CanvasTrack({form: "points"});
    this.colComments = new r.ColComments();

    this.el.appendChild(this.viewFile.el);
    this.el.appendChild(this.canvasTrack.el);
    document.body.appendChild(this.link.el);
    document.body.appendChild(this.el);
    document.body.appendChild(this.colComments.el);

    /*File ruler*/
    console.log(this.servData);

      /*Read multi files*/

    } else {

      /*Load Files & Coms*/
      this.fileGroup.setFiles(this.servData);
      this.fileGroup.fire('display');
      // this.colComments.setComGroup(this.servData.comments, this.canvasTrack.ctx);

    }

    this.fileGroup.on('display', function() {
      this.link.setLink(this.fileGroup.uid);
      console.log(this.fileGroup.files); return ;
      this.viewFile.refreshContent(this.fileGroup.renderContent(0));
      this.canvasTrack.setSize(this.viewFile.el.clientHeight, this.viewFile.el.clientWidth);
    }.bind(this));

    /*Canvas <=> Comment*/
    this.canvasTrack.on('valid', function(canArea) {
        this.colComments.addArea(canArea);
      }.bind(this));
    this.colComments.on('clearCanvas', function(canArea) {
      this.canvasTrack.clearCanvas();
    }.bind(this));

    /*Send to server*/
    ['add', 'edit', 'delete'].each(function (e) {
      this.colComments.on(e, function(data) {
        data.file_uid = this.fileGroup.uid;
        data.model = 'Com';
        this.servInterface.sendData(e, data);
      }.bind(this))
    }.bind(this));
  }

});
return appComments;
});
