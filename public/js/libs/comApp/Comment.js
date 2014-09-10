sand.define('Comment', [
  'CanvasArea',
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 5
**On:   0
*/
var Comment = r.Seed.extend({

  tpl: function() {
    return {
      tag: ".comment",
      children: [
        {tag: '.comment-wrapper', as: 'wrap', children: [
          { tag:".comButton.button", as: 'createEl', innerHTML: 'Create', events: {
            click: function(){ this.onCreate(); }.bind(this)
          }},
          { tag:".comButton.button", as: 'removeEl', innerHTML: 'Delete', events: {
            click: function(){ this.onRemove(this); }.bind(this)
          }},
          { tag:".comButton.button", as: 'editEl', innerHTML: 'Edit', events: {
            click: function(){
              if (this.elDiv.isContentEditable) { this.valid(); }
              else { this.elDiv.setAttribute('contenteditable', true); this.switchEdit(); }
            }.bind(this)
          }},
          { tag:".comButton.button", as: 'replyEl', innerHTML: 'Reply'},
          { tag:".divComment", as: 'elDiv' },
        ]}
      ]
    }
  },

  options: function() {
    return {
      id: 0,
      idFile: 0,
      idParent: 0,
      txt: '',
      onCreate: this.valid.bind(this),
      onRemove: function() { console.log('remove is not available on this element'); },
      actualTop: 0,
      areas: [],
      color: '#B3B3F9'
    }
  },

  '+init': function () {

    if (this.id === 0) {
      this.id = this.query('dp').comments.insert(this.getData()).id;
    }
    this.wrap.innerHTML = '';
    this.wrap.appendChild(this.elDiv);
    this.wrap.appendChild(this.createEl);
    this.wrap.style['border-left-color'] = this.color;
    this.elDiv.setAttribute('contenteditable', true);
  },

  /*Add/remove*/
  valid: function() {

    this.txt = this.elDiv.innerHTML;
    this.elDiv.setAttribute('contenteditable', false);
    this.switchEdit();

    this.query('dp').comments.one(function(e) { return this.id === e.id }.bind(this)).edit({'txt': this.txt});

    this.elDiv.innerHTML = this.txt.replace(/\[/g, '<pre class = "brush: js">').replace(/\]/g, '</pre>')
                                                  .replace(/<div>/g, '').replace(/<\/div>/g, '<br/>');
    for (var i = 0, len = this.elDiv.childNodes.length; i < len; i++) {
      if (this.elDiv.childNodes[i].tagName != "PRE") {
        this.elDiv.childNodes[i] = this.elDiv.childNodes[i].toString().replace(/\ /g, "&nbsp").replace(/\n/g, "<br/>");
      }
    }
    SyntaxHighlighter.highlight();
  },

  preValide: function() {
    this.elDiv.innerHTML = this.txt;
  },

  switchEdit: function() {
    this.wrap.innerHTML = '';
    if (this.elDiv.isContentEditable) {
      this.el.style["z-index"] = 100;
      this.wrap.appendChild(this.elDiv);
      this.wrap.appendChild(this.editEl);
    } else {
      this.el.style["z-index"] = 0;
      this.wrap.appendChild(this.elDiv);
      this.wrap.appendChild(this.removeEl);
      this.wrap.appendChild(document.createTextNode(' - '))
      this.wrap.appendChild(this.editEl);
      if (this.replyEl) {
        this.wrap.appendChild(document.createTextNode(' - '))
        this.wrap.appendChild(this.replyEl);
      }
    }
    this.preValide();
  },

  getData: function() {
    return { id: this.id, idParent: this.idParent, idFile: this.idFile, txt: this.txt,
      author: this.author, actualTop: this.actualTop, color: this.color, areas: this.getAreas()};
  },

  getAreas: function() {
    var tmpAreas = [];
    for (var i = 0, len = this.areas.length; i < len; i++) {
      tmpAreas.push(this.areas[i].getArea());
    }
    return tmpAreas;
  }

});
return Comment;
});
