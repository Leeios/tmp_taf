sand.define('appComments', [
  'DOM/toDOM',
  'ReadUpload',
  'FileViewer',
  'CanTrack',
  'ColComments'
], function(r) {
var appComments = function() {

  this.wrapper = r.toDOM({
    tag: "div.wrapper"
  });

  this.rUpload = new r.ReadUpload();
  this.colComments = new r.ColComments();

  document.body.appendChild(this.rUpload.el);
  document.body.appendChild(this.wrapper);
  document.body.appendChild(this.colComments.el);


  this.fileViewer = new r.FileViewer();
  this.canTrack = new r.CanTrack();

  this.wrapper.appendChild(this.fileViewer.el);
  this.wrapper.appendChild(this.canTrack.el);

  this.rUpload.on('uploadDone', function (s) {
    this.fileViewer.refreshContent(s);
    this.canTrack.setSize(this.fileViewer.el.clientHeight, this.fileViewer.el.clientWidth);
  }.bind(this));

  this.canTrack.on('validSelection', function(canArea) {
      this.colComments.addArea(canArea);
    }.bind(this));
  }

  return appComments;
});
