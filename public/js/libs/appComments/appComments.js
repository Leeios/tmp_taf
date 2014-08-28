sand.define('appComments', [
  'CanvasTrack',
  'ColComments',
  'DOM/toDOM',
  'FileFormat',
  'FileGroup',
  'GenerateLink',
  'Seed',
  'ServerInterface',
  'UploadFile',
  'ViewFile'
], function(r) {

/*
**Fire: 0
**On:   5
*/
var appComments = Seed.extend({

  tpl: {
    tag: "div.wrapper"
  },

  '+options': {
    servData: null
  },

  '+init': function() {
    /*Init page elements*/
    this.uploadFile = new r.UploadFile();
    document.body.appendChild(this.uploadFile.el);

    this.fileGroup = new r.FileGroup();
    this.link = new r.GenerateLink();
    this.servInterface = new r.ServerInterface({server: socket, protocol: "socket"});
    this.viewFile = new r.ViewFile();
    this.canvasTrack = new r.CanvasTrack({form: "points"});
    this.colComments = new r.ColComments();

    this.el.appendChild(this.viewFile.el);
    this.el.appendChild(this.canvasTrack.el);
    document.body.appendChild(this.link.el);
    document.body.appendChild(this.el);
    document.body.appendChild(this.colComments.el);

    /*File ruler*/
    console.log(this.servData);
    if (this.servData == null) {

      /*Read multi files*/
      this.uploadFile.on('uploadFile', function (f) {
        this.fileGroup.pushFile(f);
      }.bind(this));
      this.uploadFile.on('uploadEnd', function () {
        this.servInterface.sendData('add', this.fileGroup.getFiles());
        this.fileGroup.fire('display');
      }.bind(this));

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
