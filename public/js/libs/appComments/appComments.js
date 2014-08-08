sand.define('appComments', [
  'DOM/toDOM',
  'ReadUpload',
  'FileViewer',
  'CanTrack',
  'ColComments',
  'CommentServer'
], function(r) {
var appComments = function() {

  this.wrapper = r.toDOM({
    tag: "div.wrapper"
  });

  this.commentServer = new r.CommentServer();
  this.rUpload = new r.ReadUpload();
  this.colComments = new r.ColComments();

  document.body.appendChild(this.rUpload.el);
  document.body.appendChild(this.wrapper);
  document.body.appendChild(this.colComments.el);


  this.fileViewer = new r.FileViewer();
  this.canTrack = new r.CanTrack();

  this.wrapper.appendChild(this.fileViewer.el);
  this.wrapper.appendChild(this.canTrack.el);

  this.rUpload.on('fileMeta', function (data) {
    this.fileMeta = data;
  }.bind(this));
  this.rUpload.on('uploadDone', function (s) {
    this.fileViewer.refreshContent(s);
    var parseFile = { name:this.fileMeta.name, size:this.fileMeta.size, type: this.fileMeta.type, s: s };
    parseFile.model = 'File';
    this.commentServer.sendData('add', parseFile);
    this.commentServer.on('idFile', function (id) {
      this.fileMeta.id = id;
    }.bind(this));
    this.canTrack.setSize(this.fileViewer.el.clientHeight, this.fileViewer.el.clientWidth);
  }.bind(this));

  this.canTrack.on('validSelection', function(canArea) {
      this.colComments.addArea(canArea);
    }.bind(this));

  ['add', 'edit', 'delete'].each(function (e) {
    this.colComments.on(e, function(data) {
      data.file_id = this.fileMeta.id;
      data.model = 'Com';
      this.commentServer.sendData(e, data);

      if (e == 'add') {
        this.commentServer.on('idCom', function (id) {
          this.colComments.comValidation.id = id;
          this.colComments.comValidation = null;
        }.bind(this));
      }
    }.bind(this))
  }.bind(this));

}

return appComments;
});
