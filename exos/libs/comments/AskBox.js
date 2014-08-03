sand.define('Comments/AskBox', [
  'DOM/toDOM',
  "Comments/CommentsCol"
], function(r) {

var AskBox = function (sText, e) {
  this.sText = sText;
  this.com = r.toDOM({
    tag: "div",
    as: "AskBox",
    style: {
      position: "absolute",
      left: e.pageX,
      top: e.pageY,
    },
    children: [
      { tag: "input",
      as : 'inputCom',
      attr: { placeholder: "Enter a comment" },
    },
    { tag: "input",
    as: "confirmCom",
    attr: {
      type: "button",
      value: "Add",
    },
  }]
  }, document);
  document.body.appendChild(this.com);
  document.confirmCom.addEventListener("click", this.validCom.bind(this));
}

AskBox.prototype.destroy = function(e) {
  if (e.target != document.inputCom) {
    this.com.remove();
  }
};

AskBox.prototype.validCom = function(e) {
  console.log(document.inputCom);
  if (document.inputCom === "") {
    return ;
  }
  var column = new r.CommentsCol();
  column.addComment(this).bind(column);
  this.destroy(e).bind(this);
}

return AskBox;

});
