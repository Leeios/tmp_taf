sand.define('Comments/Comment', [
  'DOM/toDOM'
], function(r) {

var Comment = function(askCom) {
  this.sText = askCom.sText;
  this.com = r.toDOM({
    tag: "div",
    as: "AskBox",
    innerHTML: document.inputCom,
    style: {
      height: "10%",
      width: "20%",
      "background-color": "#7093DB"
    },
  }, document);
}

return Comment;

});
