sand.define('appComments', [
  'CanvasTrack',
  'CommentsGroup',
  'DOM/toDOM',
  'FileFormat',
  'GenerateLink',
  'Seed',
  'ServerInterface',
  'UploadFile',
  'ViewFile'
], function(r) {

var appComments = Seed.extend({

  tpl: {
    tag: "div.wrapper"
  },

  '+options': {
    servData: null
  },

  '+init': function() {
    this.uploadFile = new r.UploadFile();
    document.body.appendChild(this.uploadFile.el);

    this.file = new r.FileFormat();
    this.link = new r.GenerateLink();
    this.servInterface = new r.ServerInterface({server: socket, protocol: "socket"});
    this.viewFile = new r.ViewFile();
    this.canvasTrack = new r.CanvasTrack({form: "points"});
    this.commentsGroup = new r.CommentsGroup();

    this.el.appendChild(this.viewFile.el);
    this.el.appendChild(this.canvasTrack.el);
    document.body.appendChild(this.link.el);
    document.body.appendChild(this.el);
    document.body.appendChild(this.commentsGroup.el);

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
      this.commentsGroup.setComGroup(this.servData.comments, this.canvasTrack.ctx);
    }

    this.canvasTrack.on('validSelection', function(canArea) {
        this.commentsGroup.addArea(canArea);
      }.bind(this));

    this.commentsGroup.on('clearAll', function(canArea) {
        this.canvasTrack.clearCanvas();
      }.bind(this));

    ['add', 'edit', 'delete'].each(function (e) {
      this.commentsGroup.on(e, function(data) {
        data.file_uid = this.file.uid;
        data.model = 'Com';
        this.servInterface.sendData(e, data);
      }.bind(this))
    }.bind(this));
  }
})
return appComments;
});
