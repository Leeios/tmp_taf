sand.define('ComApp', [
  'Seed',
  'ProjectViewer',
  'Header'
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
    this.projectViewer = this.create(r.ProjectViewer, {data : this.data, server: io.connect()}, 'projview');

    this.create(r.Header, {}, 'header');
    this.header.on('newProject:click', this.projectViewer.createProject.bind(this.projectViewer), this);

    this.el = document.body;

    this.el.appendChild(this.header.el);
    if (this.data !== null) {
      this.el.appendChild(this.projectViewer.el);
      SyntaxHighlighter.highlight();
    }
  }

});
return appComments;
});
