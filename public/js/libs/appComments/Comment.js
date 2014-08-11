sand.define('Comment', [
  'CanvasArea',
  'DOM/toDOM',
  'Seed'
], function(r) {

// -init ne marche pas, a voir
  var Comment = Seed.extend({
    tpl: {
      tag: "div.comment"
    },
    '+options': {
      txt: "",
      edit: 1,
      uid: -1,
      actualTop: 0
    },
    // '-init': function () {
    // },
    '+init': function () {

      this.areas = [];
      this.create = r.toDOM({
        tag:"input.createButton",
        attr: { type: "button", value: "Create" }
      });
      this.delete = r.toDOM({
        tag:"input.deleteButton",
        attr: { type: "button", value: "Delete" }
      });
      this.elDiv = r.toDOM({
        tag:"div.divComment"
      });
      this.elTxt = r.toDOM({
        tag:"textarea.txtComment"
      });

      this.el.appendChild(this.elDiv);
      this.el.appendChild(this.elTxt);
      this.el.appendChild(this.create);
      this.el.appendChild(this.delete);

      if (this.uid == -1) {
        this.uid = this.guid()();
      }
      this.switchEdit();

      //Create or Edit
      this.create.addEventListener("click", function(e) {
        if (this.elDiv.innerHTML == "") {
          this.fire("tmpComValid");
        } else {
          this.validCom();
          this.fire("editCom", this.el);
        }
      }.bind(this));

      //Want to edit
      this.elDiv.addEventListener("click", function() {
        this.edit = 1;
        this.switchEdit();
      }.bind(this));

      //Delete
      this.delete.addEventListener("click", this.destroy.bind(this));

      this.elTxt.addEventListener("keypress", this.adjustHeight.bind(this));
      this.el.addEventListener("mouseover", this.highStyle.bind(this));
      this.el.addEventListener("mouseout", this.usualStyle.bind(this));
    }
  });

  Comment.prototype.addArea = function(canArea) {
    if (!this.areas) {
      this.areas = [];
    }
    this.areas.push(canArea);
    this.actualTop = canArea.origin[1];
    this.el.style.top = this.actualTop + "px";
    this.adjustHeight();
    this.elTxt.focus();
  };

  Comment.prototype.validCom = function() {
    this.edit = 0;
    this.switchEdit();
    this.txt = this.elTxt.value;
    this.elDiv.innerHTML = this.txt.replace(/\[/g, '<pre>').replace(/\]/g, '</pre>');
    for (var i = 0, len = this.elDiv.childNodes.length; i < len; i++) {
      if (this.elDiv.childNodes[i].tagName == "PRE") {
        hljs.highlightBlock(this.elDiv.childNodes[i]);
      } else {
        this.elDiv.childNodes[i] = this.elDiv.childNodes[i].toString().replace(/\ /g, "&nbsp").replace(/\n/g, "<br/>");
      }
    }
    this.usualStyle();
  };

  Comment.prototype.preValideCom = function() {
    this.elTxt.value = this.txt;
  }

  Comment.prototype.adjustHeight = function () {
    this.elTxt.style.height = "1px";
    this.elTxt.style.height = this.elTxt.scrollHeight + 10 + "px";
  }

  Comment.prototype.switchEdit = function() {
    if (this.edit == 0) {
      this.el.style["z-index"] = 0;
      this.elDiv.innerHTML = this.txt;
      this.el.removeChild(this.elTxt);
      this.el.appendChild(this.elDiv);
      this.el.removeChild(this.create);
      this.el.appendChild(this.delete);
    } else {
      this.el.style["z-index"] = 1;
      this.elTxt.placeholder = this.txt;
      this.el.removeChild(this.elDiv);
      this.el.appendChild(this.elTxt);
      this.el.removeChild(this.delete);
      this.el.appendChild(this.create);
      this.adjustHeight();
    }
  }

  Comment.prototype.displayArea = function() {
    for (var i = 0, len = this.areas.length; i < len; i++) {
      this.areas[i].draw();
    }
  };

Comment.prototype.highStyle = function() {
  this.el.style["background-color"] = "#17657D";
  this.areas && (this.areas[0].ctx.fillStyle =  "rgba(23, 101, 125, 0.3)");
  this.displayArea();
  this.areas && (this.areas[0].ctx.fillStyle =  "rgba(200, 200, 200, 0.3)");
};

Comment.prototype.usualStyle = function() {
  this.el.style["background-color"] = "#272822";
  this.displayArea();
};

Comment.prototype.destroy = function() {
  this.fire("deleteCom", this.el);
  this.el.remove();
  for (var i = 0, len = this.areas.length; i < len; i++) {
    this.areas[i].clearForm();
  }
};

Comment.prototype.setAreas = function(data, ctx) {
  var current_area;
  for (var i = 0, len = data.length; i < len; i++) {
    data[i].ctx = ctx;
    current_area = new r.CanvasArea(data[i]);
    current_area.refresh(current_area.end);
    this.areas.push(current_area);
  }
}

Comment.prototype.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
};

  return Comment;
});
