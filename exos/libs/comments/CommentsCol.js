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
  document.body.appendChild(com.com);
  this.displayCol();
};

CommentsCol.prototype.displayCol = function() {
  var previous_down;

  this.comArray.sort(function (a, b) {
    return a.actualTop - b.actualTop;
  });
  for (var i = -1; ++i < this.comArray.length;) {
    this.comArray[i].com.style.top = this.comArray[i].actualTop + "px";
    i > 0 && (previous_down = parseInt(this.comArray[i - 1].com.style.top) + this.comArray[i - 1].height)
    && (previous_down >= parseInt(this.comArray[i].com.style.top))
    && (this.comArray[i].com.style.top = previous_down + "px");
  }
};

CommentsCol.prototype.removeCom = function(e) {
  for (var i = -1; ++i < this.comArray.length;) {
    if (this.comArray[i].com == e.target.parentNode) {
      this.comArray[i].destroy();
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
