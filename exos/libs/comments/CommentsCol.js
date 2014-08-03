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
  console.log(this.comArray);
  this.displayCol();
};

CommentsCol.prototype.displayCol = function() {
  for (var i = -1; ++i < this.comArray.length;) {
    this.comArray[i].com.style.right = "0px";
    this.comArray[i].com.style.top = (10 * i) + "%";
    document.body.appendChild(this.comArray[i].com);
  }
};


return {
  getInstance: function() {
    if (!instance) {
      instance = new CommentsCol();
    }
    return instance;
  }
}

});
