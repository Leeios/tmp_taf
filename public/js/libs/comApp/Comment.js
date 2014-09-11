sand.define('Comment', [
  'CanvasArea',
  'prettyDate',
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
        { tag:".comButton.button", as: 'createEl', innerHTML: 'Create', events: {
          click: function(){ this.valid(); this.onCreate(); }.bind(this)
        }},
        { tag:".comButton.button", as: 'removeEl', innerHTML: 'Delete', events: {
          click: function(){ this.el.remove(); this.onRemove(this.id); }.bind(this)
        }},
        { tag:".comButton.button", as: 'editEl', innerHTML: 'Edit', events: {
          click: function(){
            if (this.elDiv.isContentEditable) { this.valid(); }
            else { this.elDiv.setAttribute('contenteditable', true); this.switchEdit(); }
          }.bind(this)
        }},
        { tag:".comButton.button", as: 'replyEl', innerHTML: 'Reply', events: {
          click: this.onReply.bind(this)
        }},
        { tag:".comment-txt", as: 'elDiv' },
        { tag: '.comment-time', as: 'timeDiv'}
      ]
    }
  },

  options: function() {
    return {
      id: 0,
      idFile: 0,
      idParent: 0,
      txt: '',
      onCreate: function() { console.log('create is not available on this element'); },
      onRemove: function() { console.log('remove is not available on this element'); },
      onReply: function() { console.log('reply is not available on this element'); },
      actualTop: 0,
      areas: [],
      color: '#B3B3F9',
      date: new Date().getTime()
    }
  },

  '+init': function () {

    if (this.id === 0) {
      this.id = this.query('dp').comments.insert(this.getData()).id;
    }
    this.el.innerHTML = '';
    this.el.appendChild(this.elDiv);
    this.el.appendChild(this.timeDiv);
    this.el.appendChild(this.createEl);
    this.elDiv.setAttribute('contenteditable', true);
  },

  /*Add/remove*/
  valid: function(newDate) {

    this.txt = this.elDiv.innerHTML;
    this.elDiv.setAttribute('contenteditable', false);
    this.switchEdit();
    this.date = newDate || new Date().getTime();
    this.query('dp').comments.one(function(e) { return this.id === e.id }.bind(this)).edit({'txt': this.txt, date: this.date});

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
    this.el.innerHTML = '';
    this.el.appendChild(this.elDiv);
    this.el.appendChild(this.timeDiv);
    if (this.elDiv.isContentEditable) {
      this.el.style["z-index"] = 100;
      this.el.appendChild(this.editEl);
    } else {
      this.el.appendChild(this.removeEl);
      this.el.appendChild(document.createTextNode(' - '))
      this.el.appendChild(this.editEl);
      if (this.replyEl) {
        this.el.appendChild(document.createTextNode(' - '))
        this.el.appendChild(this.replyEl);
      }
    }
  },

  refreshDate: function() {
    this.timeDiv.innerHTML = r.prettyDate(this.date);
  },

  getData: function() {
    return { id: this.id, idParent: this.idParent, idFile: this.idFile, txt: this.txt,
      author: this.author, actualTop: this.actualTop, color: this.color, areas: this.getAreas(), date: this.date};
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
