sand.define('ColComments', [
  'DOM/toDOM',
  'Publisher',
  'SingleComment'
], function(r) {

  var ColComments = function() {
    this.commentList = [];
    this.el = r.toDOM({
      tag: "div",
      style: {
        position: "absolute",
        top: "0px",
        right: "0px",
        width: "20%",
        "min-height": "100%"
      }
    });
  }

  ColComments.prototype.addComment = function() {
    this.tmpComment.edit = 0;
    this.commentList.push(this.tmpComment);
    this.tmpComment = null;
  };

  ColComments.prototype.addArea = function(canArea) {
    if (!this.tmpComment) {
      this.tmpComment = new r.SingleComment("Enter a comment ...", 1);
    }
    this.tmpComment.addArea(canArea);
    this.displayCol();
  };

  ColComments.prototype.displayCol = function() {
    this.el.appendChild(this.tmpComment.el);
    for (var i = 0, len = this.commentList.length; i < len; i++) {
      this.el.appendChild(this.commentList[i].el);
    }
  };

  ColComments = r.Publisher.extend(ColComments);
  return ColComments;
});
