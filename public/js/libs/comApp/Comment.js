sand.define('Comment', [
  'CanvasArea',
  'DOM/toDOM',
  'Seed'
], function(r) {

/*
**Fire: 5
**On:   0
*/
var Comment = Seed.extend({

  tpl: function() {
    return {
      tag: "div.comment",
      children: [
        { tag:"div.comButton.button", as: 'create', innerHTML: ' Create ' },
        { tag:"div.comButton.button", as: 'delete', innerHTML: ' Delete ' },
        { tag:"div.comButton.button", as: 'reply', innerHTML: ' Reply ' },
        { tag:"div.comButton.button", as: 'editEl', innerHTML: ' Edit ' },
        { tag:"div.divComment", as: 'elDiv' },
        { tag:"textarea.txtComment", as: 'elTxt' }
      ]
    }
  },

  options: function() {
    return {
      txt: "",
      edit_token: 1,
      uid: -1,
      uidParent: -1,
      actualTop: 0,
      resolved: false,
      color: '#E3E3F9'
    }
  },

  '+init': function () {

    this.areas = [];/*Ne pas mettre dans options!*/
    this.el.style['border-left-color'] = this.color;

    /*Define div*/
    if (this.uid == -1) {
      this.uid = this.guid()();
    }
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
    this.elTxt.addEventListener("keypress", this.adjustHeight.bind(this));

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
    this.fire("deleteEl", this);
    this.el.remove();
  },

  preValide: function() {
    this.elTxt.value = this.txt;
  },

  /*Style functions*/
  adjustHeight: function () {
    this.elTxt.style.height = "1px";
    this.elTxt.style.height = this.elTxt.scrollHeight + 10 + "px";
  },

  switchEdit: function() {
    this.el.innerHTML = '';
    if (this.edit_token == 0) {
      this.el.style["z-index"] = 0;
      this.elDiv.innerHTML = this.txt;
      this.el.appendChild(this.elDiv);
      this.el.appendChild(this.delete);
      this.el.appendChild(document.createTextNode('•'))
      this.el.appendChild(this.editEl);
      if (this.reply) {
        this.el.appendChild(document.createTextNode('•'))
        this.el.appendChild(this.reply);
      }
    } else {
      this.el.style["z-index"] = 1;
      this.elTxt.placeholder = this.txt;
      this.el.appendChild(this.elTxt);
      this.el.appendChild(this.create);
    }
    this.adjustHeight();
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
    this.adjustHeight();
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

  /*Use for export dataserv*/
  formateEl: function() {
    var parseCom = {};

    var parseAreas = [];
    for (var i = 0, len = this.areas.length; i < len; i++) {
      parseAreas[i] = this.areas[i].formateArea();
    }
    parseCom = {txt: this.txt, actualTop: this.actualTop, areas: parseAreas, uid: this.uid, uidParent: this.uidParent};
    return (parseCom);
  },

  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  }

});
return Comment;
});
