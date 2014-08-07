sand.define('SingleComment', [
  'DOM/toDOM',
  'Publisher'
], function(r) {

  var SingleComment = function(txt, edit) {
    this.txt = txt;
    this.edit = edit;

    this.elDiv = r.toDOM({
      tag:"div",
      innerHTML: this.txt,
      style: { display: "inline", width: "100%", height: '100%' }
    });
    this.elTxt = r.toDOM({
      tag:"textarea",
      attr: { placeholder: this.txt },
      style: { display: "inline", width: "100%", height: '100%' }
    });
    this.el = r.toDOM({
      tag: "div",
      style: {
        position: "absolute",
        top: 0,
        right: 0,
        height: "50px",
        width: "100%",
        "background-color": "#4F4F4F",
        border: "1px groove black"
      },
      children: [
      this.elDiv,
      this.elTxt,
      ]
    });
    this.switchEdit();
    this.el.addEventListener("keypress", function(e) {
      if (e.keyCode === 13) {
        this.fire("tmpComValid");
      }
    }.bind(this));
  }

  SingleComment.prototype.addArea = function(canArea) {
    if (!this.areas) {
      this.areas = [];
    }
    this.areas.push(canArea);
    console.log(canArea.origin[1], document.body.scrollTop);
    this.actualTop = canArea.origin[1];
    this.el.style.top = canArea.origin[1] + "px";
    // this.switchEdit();
  };

  SingleComment.prototype.validCom = function() {
    this.edit = 0;
    this.switchEdit();
    this.txt = this.elTxt.value;
    this.elDiv.innerHTML = this.txt;
  };

  SingleComment.prototype.switchEdit = function() {
    if (this.edit == 0) {
      this.elDiv.style.display = "inline";
      this.elTxt.style.display = "none";
    } else {
      this.elDiv.style.display = "none";
      this.elTxt.style.display = "inline";
    }
  }

  SingleComment = r.Publisher.extend(SingleComment);
  return SingleComment;
});
