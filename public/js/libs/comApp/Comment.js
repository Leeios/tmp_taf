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
        this.elDiv,
        this.elTxt,
        this.create,
        this.delete,
        this.reply
      ]
    }
  },

  options: function() {
    return {
      txt: "",
      edit: 1,
      uid: -1,
      actualTop: 0,
      resolved: false,
      create: r.toDOM({
        tag:"input.createButton.button",
        attr: { type: "button", value: "Create" }
      }),
      delete: r.toDOM({
        tag:"input.deleteButton.button",
        attr: { type: "button", value: "Delete" }
      }),
      reply: r.toDOM({
        tag:"input.replyButton.button",
        attr: { type: "button", value: "Reply" }
      }),
      elDiv: r.toDOM({
        tag:"div.divComment"
      }),
      elTxt: r.toDOM({
        tag:"textarea.txtComment"
      })
    }
  },

  '+init': function () {

    this.areas = [];
    /*Define div*/
    if (this.uid == -1) {
      this.uid = this.guid()();
    }
    this.switchEdit();

    /*Create or Edit*/
    this.create.addEventListener("click", function(e) {
      if (this.elDiv.innerHTML == "") {
        this.fire("createEl");
      } else {
        this.valid();
        this.fire("editEl", this);
      }
    }.bind(this));

    /*Edit mode*/
    this.elDiv.addEventListener("click", function() {
      this.edit = 1;
      this.switchEdit();
    }.bind(this));

    /*Delete*/
    this.delete.addEventListener("click", this.removeEl.bind(this));

    /*Reply*/
    this.reply.addEventListener("click", this.replyEl.bind(this));

    /*Resize*/
    this.elTxt.addEventListener("keypress", this.adjustHeight.bind(this));

    /*Highlight*/
    this.el.addEventListener("mouseover", this.highStyle.bind(this));
    this.el.addEventListener("mouseout", this.usualStyle.bind(this));
  },

  /*Add/remove*/
  valid: function() {
    this.edit = 0;
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

  replyEl: function() {
    this.fire("replyEl", this);
    this.addTmpComment();
    this.displaySub();
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
    if (this.edit == 0) {
      this.el.style["z-index"] = 0;
      this.elDiv.innerHTML = this.txt;
      this.elTxt.remove();
      this.el.appendChild(this.elDiv);
      this.create.remove();
      this.el.appendChild(this.delete);
      this.el.appendChild(this.reply);
    } else {
      this.el.style["z-index"] = 1;
      this.elTxt.placeholder = this.txt;
      this.elDiv.remove();
      this.el.appendChild(this.elTxt);
      this.delete.remove();
      this.reply.remove();
      this.el.appendChild(this.create);
    }
    this.adjustHeight();
  },

  highStyle: function() {
    this.el.style["background-color"] = "#17657D";
    this.fire('redraw');
    //Then redraw on select area with other stroke
    this.areas[0] && (this.areas[0].ctx.strokeStyle =  "rgba(23, 101, 125, 0.2)");
    this.displayArea();
    this.areas[0] && (this.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.el.style["background-color"] = "#272822";
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
    parseCom = {txt: this.txt, actualTop: this.actualTop, areas: parseAreas, uid: this.uid};
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
