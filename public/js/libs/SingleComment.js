sand.define('SingleComment', [
  'DOM/toDOM',
  'Publisher'
], function(r) {

  var SingleComment = function(txt, edit) {
    this.txt = txt;
    this.edit = edit;

    this.validCom = r.toDOM({
      tag: "button",
      innerHTML: "OK",
      attr: { type: "button"},
      style: { display: "inline" }
    })
    this.elDiv = r.toDOM({
      tag:"div",
      innerHTML: this.txt,
      style: { display: "inline", width: "100%" }
    });
    this.elInput = r.toDOM({
      tag:"input",
      attr: { placeholder: this.txt },
      style: { display: "inline", width: "100%" }
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
      this.elInput,
      this.validCom
      ]
    });
    this.switchEdit();
  }

  SingleComment.prototype.addArea = function(canArea) {
    if (!this.areas) {
      this.areas = [];
    }
    this.areas.push(canArea);
    console.log(canArea.origin[1], document.body.scrollTop);
    this.el.style.top = canArea.origin[1] + "px";
    this.switchEdit();
  };


  SingleComment.prototype.switchEdit = function() {
    if (this.edit === 0) {
      this.elDiv.style.display = "inline";
      this.elInput.style.display = "none";
    } else {
      this.elDiv.style.display = "none";
      this.elInput.style.display = "inline";
    }
  }

  SingleComment = r.Publisher.extend(SingleComment);
  return SingleComment;
});
