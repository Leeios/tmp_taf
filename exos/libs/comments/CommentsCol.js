sand.define('Comments/CommentsCol', [
  'DOM/toDOM',
  'Comments/Comment'
], function(r) {

var instance;

var CommentsCol = function() {

  this.comArray = [];
};

CommentsCol.prototype.addComment = function(askCom) {
  var com = new r.Comment(askCom);
  this.comArray.push(com);
  document.deleteCom.addEventListener("click", this.removeCom.bind(this));
  this.displayCol();
};

CommentsCol.prototype.displayCol = function() {
  for (var i = -1; ++i < this.comArray.length;) {
    this.comArray[i].com.style.right = "0px";
    this.comArray[i].com.style.top = (10 * i) + "%";
    document.body.appendChild(this.comArray[i].com);
  }
};

CommentsCol.prototype.removeCom = function(e) {
  for (var i = -1; ++i < this.comArray.length;) {
    if (this.comArray[i].com == e.target.parentNode) {
      this.comArray[i].com.remove();
      this.comArray.splice(i, 1);
    }
  }
  this.displayCol();
}

return {
  getInstance: function() {
    if (!instance) {
      instance = new CommentsCol();
    }
    return instance;
  }
}

});
