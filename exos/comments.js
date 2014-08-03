sand.define('Comments/basic', [
  'DOM/toDOM'
], function(r) {

var Comment = function(selection, txt, position) {
  this.sText = selection ? selection : "";
  this.text = txt ? txt : "";
  this.pos = position ? position : 0;
}

var HandleCom = function() {
  this.sText = "";
  document.addEventListener("mouseup", this.displayBox.bind(this));
}

HandleCom.prototype.getSelectedText = function() {
  sText = window.getSelection().toString();
  if (window.getSelection) {
    sText = window.getSelection().toString();
  }
  else if (document.getSelection) {
    sText = document.getSelection();
  }
  else if (document.selection) {
    sText = document.selection.createRange().text;
  }
  else return;
}

HandleCom.prototype.displayBox = function(e) {
  this.getSelectedText();
  if (sText === "")
    return ;
  console.log(sText);
  document.body.appendChild(
    r.toDOM({
      tag: "input#tmpComment",
      as : 'inputCom',
      attr: { placeholder: "Enter a comment" },
      style: {
        position: "absolute",
        left: e.pageX,
        top: e.pageY,
      }
    }, document)
  );

  var confirm = r.toDOM({
    tag: "input#tmpComment",
    as: "confirmCom",
    attr: {
      type: "button",
      value: "Add",
    },
    style: {
      position: "absolute",
      left: e.pageX + 170,
      top: e.pageY,
    }
  }, document);
  console.log("confirm");
  confirm.addEventListener("click", this.addComment.bind(this));
  document.body.appendChild(confirm);
  document.addEventListener("mousedown", this.removeBox);
}

HandleCom.prototype.removeBox = function() {
  console.log(document.confirmCom);
}

HandleCom.prototype.addComment = function(e) {
  this.removeBox();
  console.log(sText);
  console.log(e);
  document.body.appendChild(
  r.toDOM({
    tag: "div",
    as: "comment",
    innerHTML: document.input.value,
    style: {
      position: "absolute",
      right: 0,
      top: 0
    }
  }, document)
);

}

return HandleCom;

});

sand.require('Comments/basic', function(r) {
  test = new r.basic();
});
