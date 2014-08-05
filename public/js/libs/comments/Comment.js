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
      height: "30px",
      right: "0px",
      "background-color": "#7093DB"
    },
    children: [{
      tag: "input",
      as: "deleteCom",
      style: {left: "0px", top: "0px"},
      attr: {
        type: "button",
        value: "X"
      }
    }]
  }, document);
  this.height = parseInt(this.com.style.height);
  // socket.emit("newComment", {sText: this.sText, text: this.com.innerHTML, top: this.actualTop});
  this.com.addEventListener("mouseover", this.showCom.bind(this));
  this.com.addEventListener("mouseout", this.unshowCom.bind(this));
};

Comment.prototype.editSText = function() {
  this.editNode = r.toDOM({
    tag: "span",
    style: { "background-color": "#FFFF66" }
  }, document);
  this.actualTop = this.range.getBoundingClientRect().top;
  this.sText.removeAllRanges();
  this.sText.addRange(this.range);

  var frag = this.range.extractContents();
  this.editNode.appendChild(frag);
  this.range.insertNode(this.editNode);
  if (!this.range.collapsed) {
    this.range.deleteContents();
  }
  this.range.surroundContents(this.editNode);
  document.body.appendChild(this.editNode);

  this.editNode.addEventListener("mouseover", this.showCom.bind(this));
  this.editNode.addEventListener("mouseout", this.unshowCom.bind(this));
};

Comment.prototype.showCom = function() {
  this.com.style["background-color"] = "#F3F3F3";
  this.com.style["height"] = "auto";
  this.editNode.style["background-color"] = "#FF9900";
};

Comment.prototype.unshowCom = function() {
  this.com.style["background-color"] = "#7093DB";
  this.com.style["height"] = "30px";
  this.editNode.style["background-color"] = "#FFFF66";
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
