sand.define('FileContainer', [
  'Seed',
  'CanvasTrack',
  'ColComments',
  'VersionPicker',
  'UploadFile',
  'DOM/toDOM'
], function(r) {

var FileContainer = r.Seed.extend({

  tpl: function() {
    return {
        tag: 'div.container',
        children: [
          ['.container-info', [
            {tag: 'div.container-name.name', as: 'name'},
            this.create(r.VersionPicker, {
              addEl: this.create(r.UploadFile, {
                complete: function(file) {
                  this.newVersion(file, this);
                }.bind(this)
              }).el,
              onPick: this.newVersion.bind(this)//CHANGE!
            }, 'versionPicker').el
          ]],
          ['.container-content', [
            this.create(r.ColComments, {}, 'colComments').el,
            { tag: 'pre.content',
              as: 'content',
              attr: {
                unselectable: 'on',
                onselectstart: 'return false;',
                onmousedown: 'return false;'
              }
            }
          ]]
        ]
      }
    },

  options : function() {
    return {
      data: null,
      newVersion: function() { console.log('Versioning not available on this element'); },
      txt: "",
      canvasTrack: this.create(r.CanvasTrack, {form: "points"})
    };
  },

  '+init': function() {

    /*On attend le load du content pour set la canvas size*/
    this.observer = new MutationObserver(this.setCanvas.bind(this));
    var config = { childList: true };
    this.observer.observe(this.content, config);

    /*set attributes*/
    this.id = this.data.id;
    this.name.setAttribute('id', this.id);
    this.name.innerHTML = this.data.name;

    /*set & decore content*/
    this.content.innerHTML = this.data.content;
    this.txt = this.data.content;
    hljs.highlightBlock(this.content);

    /*Get comments link to file*/

    /*set commentaires & replies*/
    this.colComments.setComGroup(this.id, this.canvasTrack.getCtx());

    /*Echanges entre canvas et colcom*/
    this.canvasTrack.on('valid', this.colComments.addArea.bind(this.colComments));
    this.colComments.on('clearCanvas', this.canvasTrack.clearCanvas.bind(this.canvasTrack));
  },

  setCanvas: function(mutations) {
    this.canvasTrack.setSize(this.content.clientHeight, this.content.clientWidth);
    this.content.appendChild(this.canvasTrack.el);
    this.observer.disconnect();
  },

});
return FileContainer;
});
