sand.define('ComApp', [
  'Seed',
  'ServerInterface',
  'ProjectViewer',
  'Header',
  'UserName',
  'UploadFile'
], function(r) {

/*
**Fire: 0
**On:   5
*/
var appComments = r.Seed.extend({

  options: function() {
    return {
      data: null
    }
  },

  '+init': function() {

    this.create(r.ServerInterface, {server: socket, protocol: "socket"}, 'servInterface');

    this.projectViewer = this.create(r.ProjectViewer, {data : this.data}, 'projview');

    this.create(r.Header, {}, 'header');
    this.header.on('newProject:click', this.projectViewer.createProject.bind(this.projectViewer), this);

    this.el = document.body;

    this.el.appendChild(this.header.el);
    this.el.appendChild(this.projectViewer.el);
  }

});
return appComments;
});
