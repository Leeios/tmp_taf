sand.define('appComments', [
  'CanvasTrack',
  'ColComments',
  'DOM/toDOM',
  'FileFormat',
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

    this.file = new r.FileFormat();
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
    if (this.servData == null) {
      this.uploadFile.on('fileMeta', function (meta) {
        this.file.setMeta(meta);
      }.bind(this));
      this.uploadFile.on('uploadDone', function (s) {
        this.file.setContent(s);
        this.servInterface.sendData('add', this.file);
        this.link.setLink(this.file.uid);
        this.viewFile.refreshContent(this.file.content);
        this.canvasTrack.setSize(this.viewFile.el.clientHeight, this.viewFile.el.clientWidth);
      }.bind(this));
    } else {
      this.file.setFile(this.servData);
      this.link.setLink(this.file.uid);
      this.viewFile.refreshContent(this.file.content);
      this.canvasTrack.setSize(this.viewFile.el.clientHeight, this.viewFile.el.clientWidth);
      this.colComments.setComGroup(this.servData.comments, this.canvasTrack.ctx);
    }

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
        data.file_uid = this.file.uid;
        data.model = 'Com';
        this.servInterface.sendData(e, data);
      }.bind(this))
    }.bind(this));
  }

});
return appComments;
});
