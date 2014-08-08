sand.define('appComments', [
  'CanvasTrack',
  'CommentsGroup',
  'DOM/toDOM',
  'FileFormat',
  'GenerateLink',
  'ServerInterface',
  'UploadFile',
  'ViewFile'
], function(r) {
var appComments = function() {

  this.wrapper = r.toDOM({
    tag: "div.wrapper"
  });

  this.file = new r.FileFormat();
  this.link = new r.GenerateLink();
  this.commentServer = new r.ServerInterface();
  this.uploadFile = new r.UploadFile();
  this.commentsGroup = new r.CommentsGroup();

  document.body.appendChild(this.uploadFile.el);

  this.viewFile = new r.ViewFile();
  this.canvasTrack = new r.CanvasTrack();

  this.wrapper.appendChild(this.viewFile.el);
  this.wrapper.appendChild(this.canvasTrack.el);

  this.uploadFile.on('fileMeta', function (meta) {
    this.file.getMeta(meta);
  }.bind(this));
  this.uploadFile.on('uploadDone', function (s) {
    this.link.getLink(this.file.uid);
    document.body.appendChild(this.link.el);
    document.body.appendChild(this.wrapper);
    document.body.appendChild(this.commentsGroup.el);
    this.viewFile.refreshContent(s);
    this.file.s = s;
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

return appComments;
});
