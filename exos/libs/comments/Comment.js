sand.define('Comments/Comment', [
  'DOM/toDOM'
], function(r) {

var Comment = function(askCom) {
  this.sText = askCom.sText;
  this.range = askCom.range;
  this.editSText();
  this.com = r.toDOM({
    tag: "div",
    as: "Com",
    innerHTML: document.inputCom.value,
    style: {
      position: "absolute",
      "box-sizing": "border-box",
      border: "1px groove black",
      overflow: "hidden",
      width: "20%",
      top: this.actualTop + "px",
      height: "auto",
      right: "0px",
      "background-color": "#7093DB"
    },
    children: [{
      tag: "input",
      as: "deleteCom",
      style: {float: "left"},
      attr: {
        type: "button",
        value: "X"
      }
    }]
  }, document);
  this.height = parseInt(this.com.style.height);
  this.com.addEventListener("mouseover", this.showCom.bind(this));
};

Comment.prototype.editSText = function() {
  this.editNode = r.toDOM({
    tag: "span",
    style: { "background-color": "#FFFF66" }
  }, document);
  this.actualTop = this.range.getBoundingClientRect().top;
  this.range.surroundContents(this.editNode);
  this.editNode.addEventListener("mouseover", this.showCom.bind(this))
  this.editNode.addEventListener("mouseout", this.unshowCom.bind(this))
};

Comment.prototype.showCom = function() {
  this.com.style["background-color"] = "#F3F3F3";
  this.com.style["height"] = "auto";
  this.editNode.style["background-color"] = "#FF9900";
  this.com.addEventListener("mouseout", this.unshowCom.bind(this));
};

Comment.prototype.unshowCom = function() {
  this.com.style["background-color"] = "#7093DB";
  // this.com.style["height"] = "30px";
  this.editNode.style["background-color"] = "FFFF66";
  this.com.addEventListener("mouseover", this.showCom.bind(this));
};



Comment.prototype.destroy = function() {
  var pa = this.editNode.parentNode;
  while (this.editNode.firstChild) {
    pa.insertBefore(this.editNode.firstChild, this.editNode);
  }
  this.com.remove();
};

return Comment;

});
