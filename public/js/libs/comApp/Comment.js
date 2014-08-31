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
          { tag:"div.comButton.button", as: 'create', innerHTML: ' Create ' },
          { tag:"div.comButton.button", as: 'delete', innerHTML: ' Delete ' },
          { tag:"div.comButton.button", as: 'reply', innerHTML: ' Reply ' },
          { tag:"div.comButton.button", as: 'editEl', innerHTML: ' Edit ' },
          { tag:"div.divComment", as: 'elDiv' },
          { tag:"textarea.txtComment", as: 'elTxt' }
        ]}
      ]
    }
  },

  options: function() {
    return {
      txt: '',
      edit_token: 1,
      actualTop: 0,
      resolved: false,
      color: '#B3B3F9'
    }
  },

  '+init': function () {

    this.areas = [];/*Ne pas mettre dans options!*/
    this.wrap.style['border-left-color'] = this.color;

    this.switchEdit();

    /*Create or Edit_token*/
    this.create.addEventListener("click", function(e) {
      if (this.elDiv.innerHTML == "") {
        this.fire("createEl");
      } else {
        this.valid();
        this.fire("editEl", this);
      }
    }.bind(this));

    /*Edit mode*/
    this.editEl.addEventListener("click", function() {
      this.edit_token = 1;
      this.switchEdit();
    }.bind(this));

    /*Delete*/
    this.delete.addEventListener("click", this.removeEl.bind(this));

    /*Resize*/
    this.elTxt.addEventListener("keypress", this.setHeight.bind(this));

    /*Highlight*/
    this.el.addEventListener("mouseover", this.highStyle.bind(this));
    this.el.addEventListener("mouseout", this.usualStyle.bind(this));
  },

  /*Add/remove*/
  valid: function() {
    this.edit_token = 0;
    this.txt = this.elTxt.value;
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

  removeEl: function() {
    this.el.remove();
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
    var tmpHeight = 0;
    for (var i = 0, len = this.sub.length; i < len; i++) {
      tmpHeight += this.sub[i].el.offsetHeight;
    }
    return (tmpHeight + this.el.offsetHeight);
  },

  switchEdit: function() {
    this.wrap.innerHTML = '';
    if (this.edit_token == 0) {
      this.el.style["z-index"] = 0;
      this.elDiv.innerHTML = this.txt;
      this.wrap.appendChild(this.elDiv);
      this.wrap.appendChild(this.delete);
      this.wrap.appendChild(document.createTextNode('•'))
      this.wrap.appendChild(this.editEl);
      if (this.reply) {
        this.wrap.appendChild(document.createTextNode('•'))
        this.wrap.appendChild(this.reply);
      }
    } else {
      this.el.style["z-index"] = 4;
      this.elTxt.placeholder = this.txt;
      this.wrap.appendChild(this.elTxt);
      this.wrap.appendChild(this.create);
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
      current_area = new r.CanvasArea(data[i]);
      this.areas.push(current_area);
    }
  },

});
return Comment;
});
