sand.define('appComments', [
  'DOM/toDOM',
  'ReadUpload',
  'FileViewer',
  'CanTrack',
  'ColComments'
], function(r) {
var appComments = function() {

  this.wrapper = r.toDOM({
    tag: "div",
    style: {
      position: "relative",
      "background-color": "#4F4F4F",
      border: "1px groove black",
      width: "80%"
    }
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
    this.canTrack.setSize(this.fileViewer.el.offsetHeight, this.fileViewer.el.offsetWidth);
  }.bind(this));

  this.canTrack.on('validSelection', function(canArea) {
      this.colComments.addArea(canArea);
    }.bind(this));
  }

  return appComments;
});

//LAUNCHER
sand.require('appComments', function(r){
  //Socket co
  socket = io.connect();

  //Start comments app
  app = new r.appComments();
});
