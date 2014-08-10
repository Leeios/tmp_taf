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

  '+init': function() {
    this.uploadFile = new r.UploadFile();
    document.body.appendChild(this.uploadFile.el);

    this.file = new r.FileFormat();
    this.link = new r.GenerateLink();
    this.commentServer = new r.ServerInterface({server: socket, protocol: "socket"});
    this.viewFile = new r.ViewFile();
    this.canvasTrack = new r.CanvasTrack({form: "rectangle"});
    this.commentsGroup = new r.CommentsGroup();

    this.el.appendChild(this.viewFile.el);
    this.el.appendChild(this.canvasTrack.el);

    this.uploadFile.on('fileMeta', function (meta) {
      this.file.setMeta(meta);
    }.bind(this));
    this.uploadFile.on('uploadDone', function (s) {
      this.link.setLink(this.file.uid);
      document.body.appendChild(this.link.el);
      document.body.appendChild(this.el);
      document.body.appendChild(this.commentsGroup.el);
      this.viewFile.refreshContent(s);
      this.file.setS(s);
      this.commentServer.sendData('add', this.file);
      this.canvasTrack.setSize(this.viewFile.el.clientHeight, this.viewFile.el.clientWidth);
    }.bind(this));

    this.canvasTrack.on('validSelection', function(canArea) {
        this.commentsGroup.addArea(canArea);
      }.bind(this));

    ['add', 'edit', 'delete'].each(function (e) {
      this.commentsGroup.on(e, function(data) {
        data.file_uid = this.file.uid;
        data.model = 'Com';
        this.commentServer.sendData(e, data);
      }.bind(this))
    }.bind(this));
  }
})
return appComments;
});
