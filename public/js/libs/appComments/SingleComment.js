sand.define('SingleComment', [
  'DOM/toDOM',
  'Publisher'
], function(r) {

  var SingleComment = function(txt, edit) {
    this.txt = txt;
    this.edit = edit;

    this.create = r.toDOM({
      tag:"input.createButton",
      attr: { type: "button", value: "Create" }
    });
    this.delete = r.toDOM({
      tag:"input.deleteButton",
      attr: { type: "button", value: "Delete" }
    });
    this.elDiv = r.toDOM({
      tag:"div.divComment",
    });
    this.elTxt = r.toDOM({
      tag:"textarea.txtComment",
      attr: { placeholder: this.txt, rows: "5"}
    });
    this.el = r.toDOM({
      tag: "div.comment",
      children: [
      this.elDiv,
      this.elTxt,
      this.create,
      this.delete
      ]
    });
    this.switchEdit();

    //Create or Edit
    this.create.addEventListener("click", function(e) {
      if (this.elDiv.innerHTML == "") {
        this.fire("tmpComValid");
      } else {
        this.validCom();
      }
    }.bind(this));

    //Want to edit
    this.elDiv.addEventListener("click", function() {
      this.edit = 1;
      this.switchEdit();
    }.bind(this));

    //Delete
    this.delete.addEventListener("click", this.destroy.bind(this));

    this.el.addEventListener("mouseover", this.highStyle.bind(this));
    this.el.addEventListener("mouseout", this.usualStyle.bind(this));
  }

  SingleComment.prototype.addArea = function(canArea) {
    if (!this.areas) {
      this.areas = [];
    }
    this.areas.push(canArea);
    this.actualTop = canArea.origin[1];
    this.el.style.top = this.actualTop + "px";
    this.elTxt.focus();
  };

  SingleComment.prototype.validCom = function() {
    this.edit = 0;
    this.switchEdit();
    this.txt = this.elTxt.value;
    this.elDiv.innerHTML = this.txt.replace(/\ /g, "&nbsp").replace(/\n/g, "<"+"br/>").replace(/\[/g, '<pre>').replace(/\]/g, '</pre>');
    for (var i = 0, len = this.elDiv.childNodes.length; i < len; i++) {
      if (this.elDiv.childNodes[i].tagName == "PRE") {
        hljs.highlightBlock(this.elDiv.childNodes[i]);
      }
    }
  };

  SingleComment.prototype.switchEdit = function() {
    if (this.edit == 0) {
      this.el.removeChild(this.elTxt);
      this.el.appendChild(this.elDiv);
      this.el.removeChild(this.create);
      this.el.appendChild(this.delete);
    } else {
      this.el.removeChild(this.elDiv);
      this.el.appendChild(this.elTxt);
      this.el.removeChild(this.delete);
      this.el.appendChild(this.create);
    }
  }

  SingleComment.prototype.displayArea = function() {
    for (var i = 0, len = this.areas.length; i < len; i++) {
      this.areas[i].draw();
    }
  };

SingleComment.prototype.highStyle = function() {
  this.el.style["background-color"] = "#450245";
  this.areas && (this.areas[0].ctx.fillStyle =  "rgba(200, 0, 200, 0.3)");
  this.displayArea();
};

SingleComment.prototype.usualStyle = function() {
  this.el.style["background-color"] = "#4F4F4F";
  this.areas && (this.areas[0].ctx.fillStyle =  "rgba(0, 0, 200, 0.3)");
  this.displayArea();
};

SingleComment.prototype.destroy = function() {
  this.fire("deleteCom", this.el);
  this.el.remove();
  for (var i = 0, len = this.areas.length; i < len; i++) {
    this.areas[i].clearForm();
  }
};

  SingleComment = r.Publisher.extend(SingleComment);
  return SingleComment;
});
