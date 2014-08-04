sand.define('Comments/AskBox', [
  'DOM/toDOM',
  "Comments/CommentsCol"
], function(r) {

var AskBox = function (sText, e) {
  this.sText = sText;
  this.range = null;
  if (this.sText.rangeCount > 0) {
    this.range = this.sText.getRangeAt(0).cloneRange();
  }
  this.com = r.toDOM({
    tag: "input",
    as: 'inputCom',
    attr: { placeholder: "Enter a comment" },
    style: {
      position: "absolute",
      left: e.pageX,
      top: e.pageY,
    }
  }, document);
  document.body.appendChild(this.com);
  this.com.focus();
  this.com.addEventListener("keypress", function() {
    var key = e.keyCode;
    console.log(e.preventDefault());
    if (key == 13) {
      this.validCom.bind(this);
    }
  })
  this.com.addEventListener("click", this.validCom.bind(this));
};

AskBox.prototype.validCom = function(e) {
  if (this.com.value === "") {
    return ;
  }
  /*
  **Appelle cCol : singleton || fire event
  */
  var column = r.CommentsCol.getInstance();
  column.addComment(this);
  this.com.remove();
};

return AskBox;

});
