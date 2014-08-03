sand.define('Comments/CommentsCol', [
  'DOM/toDOM',
  'Comments/Comment'
], function(r) {


var CommentsCol = function() {

  var instance;
  this.comArray = [];

  function CommentsCol() {
    if (typeof instance != "undefined") {
      return instance;
    }
    instance = this;
  }
}


CommentsCol.prototype.singleton = function() {
  if (typeof instance == "undefined") {
    instance = new this();
  }
  return instance;
}

CommentsCol.prototype.addComment = function(askCom) {
  var com = new r.Comment(askCom);
  this.comArray.push(com);
  this.displayCol().bind(this);
};

CommentsCol.prototype.displayCol = function() {
  for (var i = -1; ++i < this.comArray.length;) {
    this.comArray[i].com.style.left = 0;
    this.comArray[i].com.style.top = (10 * i) + "%";
    document.body.appendChild(this.comArray[i].com);
  }
};

return CommentsCol;

});
