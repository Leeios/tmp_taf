sand.define('Comments/Comment', [
  'DOM/toDOM'
], function(r) {

var Comment = function(askCom) {
  this.sText = askCom.sText;
  this.com = r.toDOM({
    tag: "div",
    as: "AskBox",
    innerHTML: document.inputCom.value,
    style: {
      height: "10%",
      position: "absolute",
      width: "20%",
      "background-color": "#7093DB"
    },
    children: [{
      tag: "input",
      as: "deleteCom",
      attr: {
        type: "button",
        value: "X"
      }
    }]
  }, document);
};

return Comment;

});
