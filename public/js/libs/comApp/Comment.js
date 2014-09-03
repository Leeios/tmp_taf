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
      tag: "div.comment",
      children: [
        {tag: 'div.comment-wrapper', as: 'wrap', children: [
          { tag:"div.comButton.button", as: 'createEl', innerHTML: 'Create', events: {
            click: function(){ this.onCreate(); }.bind(this)
          }},
          { tag:"div.comButton.button", as: 'removeEl', innerHTML: 'Delete', events: {
            click: function(){ this.onRemove(this); }.bind(this)
          }},
          { tag:"div.comButton.button", as: 'editEl', innerHTML: 'Edit', events: {
            click: function(){
              if (this.edit_token == 1) { this.valid() }
              else { this.edit_token = 1; this.switchEdit(); }
            }.bind(this)
          }},
          { tag:"div.comButton.button", as: 'replyEl', innerHTML: 'Reply'},
          { tag:"div.divComment", as: 'elDiv' },
          { tag:"textarea.txtComment", as: 'elTxt',
            attr: {placeholder: this.txt}, events: {
            keypress: this.setHeight.bind(this)
          }}
        ]}
      ], events: {
        mouseover: this.highStyle.bind(this),
        mouseout: this.usualStyle.bind(this)
      }
    }
  },

  options: function() {
    return {
      idFile: 0,
      idParent: 0,
      txt: '',
      onCreate: function() { console.log('Create is not available on this element'); },
      onRemove: function() { console.log('remove is not available on this element'); },
      edit_token: 1,
      actualTop: 0,
      color: '#B3B3F9'
    }
  },

  '+init': function () {

    this.areas = [];
    this.wrap.style['border-left-color'] = this.color;
    this.wrap.innerHTML = '';
    this.wrap.appendChild(this.elTxt);
    this.wrap.appendChild(this.createEl);
  },

  /*Add/remove*/
  valid: function(events) {

    this.edit_token = 0;
    this.txt = this.elTxt.value;

    var search = this.query('dp').comments.one(function(e) { return this.id === e.id }.bind(this));
    if (search != null) {
      search.edit({'txt': this.txt});
    }
    this.switchEdit();

    this.elDiv.innerHTML = this.txt.replace(/\[/g, '<pre>').replace(/\]/g, '</pre>');
    for (var i = 0, len = this.elDiv.childNodes.length; i < len; i++) {
      if (this.elDiv.childNodes[i].tagName == "PRE") {
        hljs.highlightBlock(this.elDiv.childNodes[i]);
      } else {
        this.elDiv.childNodes[i] = this.elDiv.childNodes[i].toString().replace(/\ /g, "&nbsp").replace(/\n/g, "<br/>");
      }
    }
    this.usualStyle();
  },

  preValide: function() {
    this.elTxt.value = this.txt;
  },

  /*Style functions*/
  setHeight: function () {
    this.elTxt.style.height = "0px";
    this.elTxt.style.height = this.elTxt.scrollHeight + 10 + "px";
  },

  getHeight: function() {
    if (typeof this.comments == 'undefined') {
      return this.el.offsetHeight;
    }

    var tmpHeight = 0;
    for (var i = 0, len = this.comments.length; i < len; i++) {
      tmpHeight += this.comments[i].el.offsetHeight;
    }
    return (tmpHeight + this.el.offsetHeight);
  },

  switchEdit: function() {
    this.wrap.innerHTML = '';
    if (this.edit_token == 0) {
      this.el.style["z-index"] = 0;
      this.elDiv.innerHTML = this.txt;
/*      this.query('dp', )*/
      this.wrap.appendChild(this.elDiv);
      this.wrap.appendChild(this.removeEl);
      this.wrap.appendChild(document.createTextNode(' • '))
      this.wrap.appendChild(this.editEl);
      if (this.replyEl) {
        this.wrap.appendChild(document.createTextNode(' • '))
        this.wrap.appendChild(this.replyEl);
      }
    } else {
      this.el.style["z-index"] = 10;
      this.elTxt.placeholder = this.txt;
      this.wrap.appendChild(this.elTxt);
      this.wrap.appendChild(this.editEl);
    }
    this.setHeight();
  },

  highStyle: function() {
    this.el.style["background-color"] = "#F3F3F4";
    this.fire('redraw');
    //Then redraw on select area with other stroke
    this.areas[0] && (this.areas[0].ctx.strokeStyle =  "rgba(23, 101, 125, 0.2)");
    this.displayArea();
    this.areas[0] && (this.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.el.style["background-color"] = "#FFFFFF";
    this.fire('redraw');
    this.displayArea();
  },

  /*Areas functions*/
  addArea: function(canArea) {
    this.areas.push(canArea);
    this.actualTop = canArea.pos[1];
    this.el.style.top = this.actualTop + "px";
    this.setHeight();
    this.elTxt.focus();
  },

  displayArea: function() {
    for (var i = 0, len = this.areas.length; i < len; i++) {
      this.areas[i].draw();
    }
  },

  /*Use for import dataserv*/
  setAreas: function(data, ctx) {
    var current_area;
    for (var i = 0, len = data.length; i < len; i++) {
      data[i].ctx = ctx;
      current_area = this.create(r.CanvasArea, data[i]);
      this.areas.push(current_area);
    }
  },

  getData: function() {
    var tmpAreas = [];
    for (var i = 0, len = this.areas.length; i < len; i++) {
      tmpAreas.push(this.areas[i].getArea());
    }
    return { id: this.id, idParent: this.idParent, idFile: this.idFile, txt: this.txt,
      author: this.author, actualTop: this.actualTop, color: this.color, areas: tmpAreas};
  }

});
return Comment;
});
