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
    console.log(this)
    this.tmpComment.validCom();
    this.el.appendChild(this.tmpComment.el);
    this.commentList.push(this.tmpComment);
    this.tmpComment = null;
    this.displayCol();
  };

  ColComments.prototype.addArea = function(canArea) {
    if (!this.tmpComment) {
      this.tmpComment = new r.SingleComment("Enter a comment ...", 1);
      this.tmpComment.on("tmpComValid", this.addComment.bind(this));
      this.el.appendChild(this.tmpComment.el);
    }
    this.tmpComment.addArea(canArea);
  };

  ColComments.prototype.displayCol = function() {
    var previous_down;

    this.commentList.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });

    for (var i = 0, len = this.commentList.length; i < len; i++) {
      this.commentList[i].el.style.top = this.commentList[i].actualTop + "px";
      i > 0 && (previous_down = parseInt(this.commentList[i - 1].el.style.top) + parseInt(this.commentList[i - 1].el.style.height))
      && (previous_down >= parseInt(this.commentList[i].el.style.top))
      && (this.commentList[i].el.style.top = previous_down + "px");
    }
  };

  ColComments = r.Publisher.extend(ColComments);
  return ColComments;
});
